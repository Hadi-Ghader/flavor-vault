using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;
using System.Data.Common;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class RatingRepository : IRatingRepository
    {
        private readonly string _connectionString;

        public RatingRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<bool> AddRatingAsync(Rating rating)
        {
            var dbconnection = Connection;
            var query = @"INSERT INTO public.""ratings"" (stars_count, user_id, recipe_id) 
                VALUES (@StarsCount, @UserId, @RecipeId);";

            var result = await dbconnection.ExecuteAsync(query, new 
            {
                StarsCount = rating.StarsCount,
                UserId = rating.UserId,
                RecipeId = rating.RecipeId
            });

            return result > 0;
        }

        public async Task<double> GetAverageRatingAsync(int recipeId)
        {
            var dbconnection = Connection;
            var query = @"SELECT AVG(CAST(stars_count AS FLOAT)) FROM public.""ratings""
                            WHERE recipe_id = @RecipeId;";

            var average = await dbconnection.ExecuteScalarAsync<double>(query, new { RecipeId = recipeId });
            return average;
        }

        public async Task<bool> HasUserRatedAsync(int userId, int recipeId)
        {
            var dbconnection = Connection;
            var query = @"SELECT COUNT(1) FROM public.""ratings"" 
                        WHERE user_id = @UserId AND recipe_id = @RecipeId";

            var count = await dbconnection.ExecuteScalarAsync<int>(query, new 
            { 
                UserId = userId, 
                RecipeId = recipeId 
            });
            return count > 0;
        }
    }
}
