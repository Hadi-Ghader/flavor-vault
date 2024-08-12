using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface IRatingService
    {
        public Task<bool> SubmitRatingAsync(RatingWithoutIdDTO ratingDto);
        public Task<bool> HasUserRatedAsync(int userId, int recipeId);
        public Task<double> GetAverageRatingAsync(int recipeId);
        public Task<int> GetAverageRatingAsyncCountAsync(int userId, int recipeId);
    }
}
