using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IRecipeRepository
    {
        public Task<IEnumerable<Recipe>> GetAllRecipesAsync();
        public Task<IEnumerable<Recipe>> GetAllRecipesWithUserInteractionsAsync(int userId);
        public Task<Recipe> GetRecipeByIdAsync(int id);
        public Task<Recipe> InsertRecipeAsync(Recipe recipe);
        public Task<IEnumerable<Recipe>> SearchRecipesAsync(string searchQuery);
    }
}
