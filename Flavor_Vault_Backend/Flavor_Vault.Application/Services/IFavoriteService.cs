using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface IFavoriteService
    {
        public Task<IEnumerable<FavoriteRecipeByUserDTO>> GetFavoritesForUserAsync(int id);
    }
}
