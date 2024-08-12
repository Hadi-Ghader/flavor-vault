using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IRatingRepository
    {
        public Task<bool> AddRatingAsync(Rating rating);
        public Task<bool> HasUserRatedAsync(int userId, int recipeId);
        public Task<double> GetAverageRatingAsync(int recipeId);
        public Task<int> GetRatingByUserForRecipeAsync(int userId, int recipeId);
    }
}