using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface IRecipeService
    {
        public Task InsertRecipeAsync(RecipeDTO recipe);
    }
}
