using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly string _connectionString;

        public CategoryRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync() 
        {
            var dbconnection = Connection;
            const string query = @"SELECT * FROM public.""categories"" ";

            var categories = await dbconnection.QueryAsync<Category>(query);

            return categories; 
        }
    }
}
