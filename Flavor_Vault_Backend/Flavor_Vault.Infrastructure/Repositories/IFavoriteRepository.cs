using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IFavoriteRepository
    {
        public Task<IEnumerable<FavoriteRecipeByUser>> GetFavoritesForUserAsync(int userId);
    }
}
