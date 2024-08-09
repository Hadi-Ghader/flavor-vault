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

        public async Task<IEnumerable<int>> GetUserLikedRecipeIdsAsync(int userId)
        {
            using var dbconnection = Connection;
            const string query = @" SELECT 
                                    recipe_id
                                FROM public.""likes""
                                WHERE user_id = @UserId; ";

            var likedRecipeIds = await dbconnection.QueryAsync<int>(query, new
            {
                UserId = userId
            });
            return new HashSet<int>(likedRecipeIds);
        }

        public async Task<IEnumerable<FavoriteRecipeByUser>> GetFavoritesForUserAsync(int userId)
        {
            var dbconnection = Connection;
            const string query = @" SELECT f.id, r.id AS recipeId, r.title, r.body, r.image_url AS imageUrl
                                    FROM public.""favorites"" as f
                                    JOIN public.""users"" as u ON f.user_id = u.id
                                    JOIN public.""recipes"" as r ON f.recipe_id = r.id
                                    WHERE u.id = @UserId; ";

            var favorites = await dbconnection.QueryAsync<FavoriteRecipeByUser>(query, new
            {
                UserId = userId
            });
            return favorites;
        }

        public async Task<bool> UserHasFavoritedAsync(int userId, int recipeId)
        {
            var dbconnection = Connection;
            const string query = @" SELECT COUNT(*) FROM public.""favorites"" WHERE user_id = @UserId AND recipe_id = @RecipeId; ";

            var count = await dbconnection.ExecuteScalarAsync<int>(query, new
            {
                UserId = userId,
                RecipeId = recipeId
            });

            return count > 0;
        }

        public async Task InsertUserFavroiteAsync(Favorite favorite)
        {
            var dbconnection = Connection;
            const string query = @" INSERT INTO public.""favorites"" (user_id, recipe_id) VALUES (@UserId, @RecipeId); ";

            await dbconnection.ExecuteAsync(query, new 
            { 
                UserId = favorite.UserId,
                RecipeId = favorite.RecipeId
            });
        }

        public async Task DeleteUserFavoriteAsync(int userId, int recipeId)
        {
            var dbconnection = Connection;
            const string query = @" DELETE FROM public.""favorites"" WHERE user_id = @UserId AND recipe_id = @RecipeId; ";

            await dbconnection.ExecuteAsync(query, new
            {
                UserId = userId,
                RecipeId = recipeId
            });
        }
    }
}
