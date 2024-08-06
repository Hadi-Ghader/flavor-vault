using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface ILikeService
    {
        Task<bool> AddLikeAsync(LikeDTO likeDTO);
        Task<int> GetAllLikesAsync(int id);
        Task<bool> UserHasLikedAsync(int userId, int recipeId);
        Task DeleteLikeAsync(int userId, int recipeId);
    }
}
