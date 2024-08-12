using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface IRecipeService
    {
        public Task<IEnumerable<RecipeDTO>> GetAllRecipesWithUserInteractionsAsync(int userId);
        public void ValidateRecipe(RecipeDTO recipeDTO);
        public Task<RecipeDTO> GetRecipeByIdAsync(int id);
        public Task InsertRecipeAsync(RecipeDTO recipe);
        public Task<IEnumerable<RecipeDTO>> SearchRecipesAsync(string query);
    }
}
