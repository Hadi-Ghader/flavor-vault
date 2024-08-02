using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface IRecipeService
    {
        public void ValidateRecipe(RecipeDTO recipeDTO);
        public Task<RecipeDTO> GetRecipeByIdAsync(int id);
        public Task InsertRecipeAsync(RecipeDTO recipe);
        public Task<IEnumerable<RecipeDTO>> SearchRecipesAsync(string query);
    }
}
