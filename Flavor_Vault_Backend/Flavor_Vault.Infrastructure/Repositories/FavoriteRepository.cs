using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class FavoriteRepository : IFavoriteRepository
    {
        private readonly string _connectionString;

        public FavoriteRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<FavoriteRecipeByUser>> GetFavoritesForUserAsync(int userId)
        {
            var dbconnection = Connection;
            const string query = @" SELECT f.id, r.id as recipe_id, r.title, r.body 
                                    FROM public.""favorites"" as f
                                    JOIN public.""users"" as u ON f.user_id = u.id
                                    JOIN public.""recipes"" as r ON f.recipe_id = r.id
                                    WHERE u.id = @UserId; ";

            var favorites = await dbconnection.QueryAsync<FavoriteRecipeByUser>(query, new { UserId = userId });
            return favorites;
        }
    }
}
