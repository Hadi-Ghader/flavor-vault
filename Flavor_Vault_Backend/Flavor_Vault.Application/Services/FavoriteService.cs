using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class FavoriteService : IFavoriteService
    {
        private readonly IFavoriteRepository _favoriteRepositroy;
        private readonly IMapper _mapper;

        public FavoriteService(IFavoriteRepository favoriteRepositroy, IMapper mapper)
        {
            _favoriteRepositroy = favoriteRepositroy;
            _mapper = mapper;
        }

        public async Task<IEnumerable<FavoriteRecipeByUserDTO>> GetFavoritesForUserAsync(int id)
        {
            var favorites = await _favoriteRepositroy.GetFavoritesForUserAsync(id);
            var favortiesDTO = _mapper.Map<IEnumerable<FavoriteRecipeByUserDTO>>(favorites);

            return favortiesDTO;
        }
    }
}
