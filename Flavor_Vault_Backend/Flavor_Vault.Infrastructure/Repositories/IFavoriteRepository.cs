using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IFavoriteRepository
    {
        public Task<IEnumerable<FavoriteRecipeByUser>> GetFavoritesForUserAsync(int userId);
        public Task<IEnumerable<int>> GetUserLikedRecipeIdsAsync(int userId);
        public Task<bool> UserHasFavoritedAsync(int userId, int recipeId);
        public Task InsertUserFavroiteAsync(Favorite favorite);
        public Task DeleteUserFavoriteAsync(int userId, int recipeId);
    }
}
