using System.Data;
using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class UserRepository : IUserRepository
    {
        private readonly string _connectionString;

        public UserRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<bool> EmailExistsAsync(string email)
        {
            using var dbConnection = Connection;
            const string query = @"SELECT COUNT(1) FROM public.""users"" WHERE ""email"" = @Email ";

            var count = await dbConnection.ExecuteScalarAsync<int>(query, new
            {
                Email = email
            });

            return count > 0;
        }

        public async Task<User> GetUserByEmailAsync(string email)
        {
            using var dbConnection = Connection;
            const string query = @"SELECT * FROM public.""users"" WHERE ""email"" = @Email ";

            var user = await dbConnection.QuerySingleOrDefaultAsync<User>(query, new { 
                Email = email
            });

            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            return user;
        }

        public async Task UserSignUpAsync(User user)
        {
            using var dbConnection = Connection;
            const string query = @"INSERT INTO public.""users""(""email"", ""password"", ""name"")  VALUES(@Email, @PasswordHash, @Name) ";

            await dbConnection.ExecuteAsync(query, new {
                user.Email,
                user.PasswordHash,
                user.Name
            });
        }
    }
}
