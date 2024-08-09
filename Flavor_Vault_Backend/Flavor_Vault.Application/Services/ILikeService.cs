using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Services
{
    public interface ILikeService
    {
        Task<bool> AddLikeAsync(LikeDTO likeDTO);
        public Task<IEnumerable<RecipeDTO>> GetRecipesWithLikeStatusAsync(int userId);
        Task<int> GetAllLikesAsync(int id);
        Task<bool> UserHasLikedAsync(int userId, int recipeId);
        Task DeleteLikeAsync(int userId, int recipeId);
    }
}
