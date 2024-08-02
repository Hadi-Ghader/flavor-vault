using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly string _connectionString;

        public RecipeRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<Recipe> GetRecipeByIdAsync(int id)
        {
            using var dbconnection = Connection;
            const string query = @"SELECT * FROM public.""results"" WHERE ""id"" = @Id";

            var result = await dbconnection.QuerySingleOrDefaultAsync<Recipe>(query, new { Id = id });

            return result;
        }

        public async Task InsertRecipeAsync(Recipe recipe)
        {
            using var dbConnection = Connection;
            const string query = @"INSERT INTO public.""recipes""(title, body, user_id, category_id) 
                                VALUES(@Title, @Body, @UserId, @CategoryId) ";

            await dbConnection.ExecuteAsync(query, new
            {
                Title = recipe.Title,
                Body = recipe.Body,
                UserId = recipe.UserId,
                CategoryId = recipe.CategoryId
            });
        }

        public async Task<IEnumerable<Recipe>> SearchRecipesAsync(string searchQuery)
        {
            using var dbconnection = Connection;
            const string query = @"SELECT * FROM public.""recipes""
                                        WHERE title ILIKE '%recipe%' 
                                        OR EXISTS (
                                            SELECT * 
                                            FROM unnest(body) AS r 
                                            WHERE r ILIKE '%recipe%'
                                        );";

            var result = await dbconnection.QueryAsync<Recipe>(query, new
            {
                Query = $"%{query}%"
            });

            return result;
        }
    }
}
