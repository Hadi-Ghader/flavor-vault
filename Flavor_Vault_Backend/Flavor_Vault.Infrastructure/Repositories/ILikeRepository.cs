using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface ILikeRepository
    {
        Task<bool> UserHasLikedAsync(int userId, int recipeId);
        Task AddLikeAsync(Like like);
        Task<int> GetAllLikesAsync(int id);
        Task DeleteLikeAsync(int userId, int recipeId);
    }
}
