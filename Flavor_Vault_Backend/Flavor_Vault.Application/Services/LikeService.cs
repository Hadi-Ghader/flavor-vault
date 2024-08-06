using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class LikeService : ILikeService
    {
        private readonly ILikeRepository _likeRepositroy;
        private readonly IMapper _mapper;

        public LikeService(ILikeRepository likeRepositroy, IMapper mapper)
        {
            _likeRepositroy = likeRepositroy;
            _mapper = mapper;
        }

        public async Task<bool> AddLikeAsync(LikeDTO likeDTO)
        {
            if (await _likeRepositroy.UserHasLikedAsync(likeDTO.UserId, likeDTO.RecipeId)) {
                return false;
            }

            var like = _mapper.Map<Like>(likeDTO);

            await _likeRepositroy.AddLikeAsync(like);

            return true;
        }

        public async Task<int> GetAllLikesAsync(int id)
        {
            var likes = await _likeRepositroy.GetAllLikesAsync(id);
            return likes;
        }

        public async Task<bool> UserHasLikedAsync(int userId, int recipeId)
        {
            var isLiked = await _likeRepositroy.UserHasLikedAsync(userId, recipeId);

            return isLiked;

        }

        public async Task DeleteLikeAsync(int userId, int recipeId)
        {
            await _likeRepositroy.DeleteLikeAsync(userId, recipeId);
        }
    }
}
