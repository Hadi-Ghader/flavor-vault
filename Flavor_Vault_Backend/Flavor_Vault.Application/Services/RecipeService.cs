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

        public async Task<RecipeDTO> GetRecipeByIdAsync(int id)
        {
            var recipe = await _recipeRepository.GetRecipeByIdAsync(id);
            var recipeDTO = _mapper.Map<RecipeDTO>(recipe);

            return recipeDTO;
        }

        public void ValidateRecipe(RecipeDTO recipeDTO)
        {
            if (string.IsNullOrWhiteSpace(recipeDTO.Title))
            {
                throw new ArgumentException("Title is required.");
            }
            if (recipeDTO.Body.All(string.IsNullOrWhiteSpace))
            {
                throw new ArgumentException("Body is required.");
            }
            if (recipeDTO.UserId <= 0)
            {
                throw new ArgumentException("Invalid category ID.");
            }
            if (recipeDTO.CategoryId <= 0)
            {
                throw new ArgumentException("Invalid category ID.");
            }
        }

        public async Task InsertRecipeAsync(RecipeDTO recipeDTO)
        {
            ValidateRecipe(recipeDTO);

            var recipe = _mapper.Map<Recipe>(recipeDTO);

            await _recipeRepository.InsertRecipeAsync(recipe);
        }

        public async Task<IEnumerable<RecipeDTO>> SearchRecipesAsync(string query)
        {
            var recipes = await _recipeRepository.SearchRecipesAsync(query);
            var recipesDTO = _mapper.Map<IEnumerable<RecipeDTO>>(recipes);

            return recipesDTO;
        }
    }
}
