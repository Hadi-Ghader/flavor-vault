using AutoMapper;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class RecipeService : IRecipeService
    {
        private readonly IRecipeRepository _recipeRepository;
        private readonly IMapper _mapper;

        public RecipeService(IRecipeRepository recipeRepository, IMapper recipeMapper)
        {
            _recipeRepository = recipeRepository;
            _mapper = recipeMapper;
        }

        public async Task InsertRecipeAsync(RecipeDTO recipeDTO)
        {
            var recipe = _mapper.Map<Recipe>(recipeDTO);

            await _recipeRepository.InsertRecipeAsync(recipe);
        }
    }
}
