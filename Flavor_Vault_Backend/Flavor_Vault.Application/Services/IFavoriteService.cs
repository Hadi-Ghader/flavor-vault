using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface IFavoriteService
    {
        public Task<IEnumerable<FavoriteRecipeByUserDTO>> GetFavoritesForUserAsync(int id);
        public Task<IEnumerable<FavoriteRecipeByUserDTO>> GetUserFavoritesWithLikesAsync(int userId);
        public Task<bool> UserHasFavoritedAsync(int userId, int recipeId);
        public Task<bool> InsertUserFavroiteAsync(FavoriteDTO favoriteDTO);
        public Task DeleteUserFavoriteAsync(int userId, int recipeId);
    }
}
