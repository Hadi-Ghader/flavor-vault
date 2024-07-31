using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface IRecipeService
    {
        public void ValidateRecipe(RecipeDTO recipeDTO); 
        public Task InsertRecipeAsync(RecipeDTO recipe);
    }
}
