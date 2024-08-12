using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class RatingService : IRatingService
    {
        private readonly IRatingRepository _ratingRepository;
        private readonly IMapper _mapper;

        public RatingService(IRatingRepository ratingRepository, IMapper mapper)
        {
            _ratingRepository = ratingRepository;
            _mapper = mapper;
        }

        public async Task<bool> SubmitRatingAsync(RatingWithoutIdDTO ratingDto)
        {
            var hasRated = await _ratingRepository.HasUserRatedAsync(ratingDto.UserId, ratingDto.RecipeId);
            if (hasRated)
            {
                return false;
            }

            var rating = _mapper.Map<Rating>(ratingDto);
            return await _ratingRepository.AddRatingAsync(rating);
        }

        public async Task<bool> HasUserRatedAsync(int userId, int recipeId)
        {
            return await _ratingRepository.HasUserRatedAsync(userId, recipeId);
        }

        public async Task<double> GetAverageRatingAsync(int recipeId)
        {
            return await _ratingRepository.GetAverageRatingAsync(recipeId);
        }

        public async Task<int> GetAverageRatingAsyncCountAsync(int userId, int recipeId)
        {
            return await _ratingRepository.GetRatingByUserForRecipeAsync(userId, recipeId);
        }
    }
}
