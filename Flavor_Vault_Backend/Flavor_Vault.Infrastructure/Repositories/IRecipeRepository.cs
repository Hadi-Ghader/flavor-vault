using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IRecipeRepository
    {
        public Task<IEnumerable<Recipe>> GetAllRecipesAsync();
        public Task<Recipe> GetRecipeByIdAsync(int id);
        public Task InsertRecipeAsync(Recipe recipe);
        public Task<IEnumerable<Recipe>> SearchRecipesAsync(string searchQuery);
    }
}
