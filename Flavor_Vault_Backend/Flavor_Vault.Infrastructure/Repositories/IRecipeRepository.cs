using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IRecipeRepository
    {
        public Task InsertRecipeAsync(Recipe recipe);
    }
}
