using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepository;
        private readonly IMapper _mapper;

        public FavoriteService(IFavoriteRepository favoriteRepository, IMapper mapper)
        {
            _favoriteRepository = favoriteRepository;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FavoriteRecipeByUserDTO>> GetUserFavoritesWithLikesAsync(int userId)
        {
            var userFavorites = await _favoriteRepository.GetFavoritesForUserAsync(userId);

            var likedRecipeIds = await _favoriteRepository.GetUserLikedRecipeIdsAsync(userId);

            var userFavoritesDTOS = _mapper.Map<IEnumerable<FavoriteRecipeByUserDTO>>(userFavorites);

            foreach (var userFavoritesDTO in userFavoritesDTOS)
            {
                userFavoritesDTO.IsLiked = likedRecipeIds.Contains(userFavoritesDTO.Id);
            }

            return userFavoritesDTOS;
        }

        public async Task<IEnumerable<FavoriteRecipeByUserDTO>> GetFavoritesForUserAsync(int id)
        {
            var favorites = await _favoriteRepository.GetFavoritesForUserAsync(id);
            var favortiesDTO = _mapper.Map<IEnumerable<FavoriteRecipeByUserDTO>>(favorites);

            return favortiesDTO;
        }

        public async Task<bool> UserHasFavoritedAsync(int userId, int recipeId)
        {
            var isFavorite = await _favoriteRepository.UserHasFavoritedAsync(userId, recipeId);

            return isFavorite;
        }

        public async Task<bool> InsertUserFavroiteAsync(FavoriteDTO favoriteDTO)
        {
            if (await _favoriteRepository.UserHasFavoritedAsync(favoriteDTO.UserId, favoriteDTO.RecipeId)) 
            {
                return false;
            }

            var favorite = _mapper.Map<Favorite>(favoriteDTO);

            await _favoriteRepository.InsertUserFavroiteAsync(favorite);

            return true;
        }

        public async Task DeleteUserFavoriteAsync(int userId, int recipeId)
        {
            await _favoriteRepository.DeleteUserFavoriteAsync(userId, recipeId);
        }        
    }
}
