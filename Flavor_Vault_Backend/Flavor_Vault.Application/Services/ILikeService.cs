using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface ILikeService
    {
        Task<bool> AddLikeAsync(LikeDTO likeDTO);
        Task<int> GetAllLikesAsync(int id);
    }
}
