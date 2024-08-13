using Dapper;
using Flavor_Vault.Core.Entities;
using Npgsql;
using System.Data;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public class RecipeRepository : IRecipeRepository
    {
        private readonly string _connectionString;
        private readonly ILikeRepository _likeRepository;
        private readonly IFavoriteRepository _favoriteRepository;

        public RecipeRepository(string connectionString, ILikeRepository likeRepository, IFavoriteRepository favoriteRepository)
        {
            _connectionString = connectionString;
            _likeRepository = likeRepository;
            _favoriteRepository = favoriteRepository;
        }

        private IDbConnection Connection => new NpgsqlConnection(_connectionString);

        public async Task<IEnumerable<Recipe>> GetAllRecipesAsync()
        {
            using var dbconnection = Connection;
            string query = @"SELECT id, title, body, image_url FROM public.""recipes"" ";

            var recipes =  await dbconnection.QueryAsync<Recipe>(query);
            return recipes;
        }

        public async Task<IEnumerable<Recipe>> GetAllRecipesWithUserInteractionsAsync(int userId)
        {
            using var dbconnection = Connection;

            const string query = @"SELECT id AS Id, title AS Title, body AS Body, user_id AS UserId, category_id AS CategoryId, image_url as imageUrl
                                   FROM public.""recipes"";";
            var recipes = await dbconnection.QueryAsync<Recipe>(query);

            foreach (var recipe in recipes)
            {
                recipe.IsLiked = await _likeRepository.UserHasLikedAsync(userId, recipe.Id);
                recipe.IsFavorited = await _favoriteRepository.UserHasFavoritedAsync(userId, recipe.Id);
            }

            return recipes;
        }

        public async Task<Recipe> GetRecipeByIdAsync(int id)
        {
            using var dbconnection = Connection;
            const string query = @"SELECT id AS Id, title AS Title, body AS Body, user_id AS UserId, category_id AS CategoryId, image_url as imageUrl 
                                    FROM public.""recipes"" 
                                    WHERE ""id"" = @Id";

            var result = await dbconnection.QuerySingleOrDefaultAsync<Recipe>(query, new { Id = id });

            return result!;
        }

        public async Task<Recipe> InsertRecipeAsync(Recipe recipe)
        {
            using var dbConnection = Connection;
            const string query = @"INSERT INTO public.""recipes""(title, body, user_id, category_id, image_url) 
                                VALUES(@Title, @Body, @UserId, @CategoryId, @ImageUrl)
                                RETURNING id AS Id, title, body, user_id AS UserId, category_id AS CategoryId, image_url AS ImageUrl;";

            var insertedRecipe = await dbConnection.QuerySingleAsync<Recipe>(query, new
            {
                Title = recipe.Title,
                Body = recipe.Body,
                UserId = recipe.UserId,
                CategoryId = recipe.CategoryId,
                ImageUrl = recipe.ImageUrl
            });

            return insertedRecipe;
        }

        public async Task<IEnumerable<Recipe>> SearchRecipesAsync(string searchQuery)
        {
            using var dbconnection = Connection;
            const string query = @"SELECT id AS Id, title AS Title, body AS Body, user_id AS UserId, category_id AS CategoryId, image_url AS imageUrl
                       FROM public.""recipes""
                       WHERE title ILIKE @Query 
                       OR EXISTS (
                           SELECT * 
                           FROM unnest(body) AS r 
                           WHERE r ILIKE @Query
                       );";

            var result = await dbconnection.QueryAsync<Recipe>(query, new
            {
                Query = $"%{searchQuery}%"
            });

            return result;
        }
    }
}
