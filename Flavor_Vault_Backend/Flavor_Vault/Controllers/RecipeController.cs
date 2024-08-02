using Flavor_Vault.Application.Services;
using Flavor_Vault.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Flavor_Vault.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeController : Controller
    {
        private readonly IRecipeService _recipeService;

        public RecipeController(IRecipeService recipeService)
        {
            _recipeService = recipeService;
        }

        [HttpGet("getRecipeById")]
        public async Task<IActionResult> GetRecipeById(int id)
        {
            if (id <= 0)
            {
                return BadRequest("Recipe Id can not be less than or equal to zero");
            }

            var recipe = await _recipeService.GetRecipeByIdAsync(id);
            if (recipe == null)
            {
                return NotFound("Can not find recipe");
            }

            return Ok(recipe);
        }

        [HttpPost("uploadrecipe")]
        public async Task<IActionResult> InsertRecipeAsync([FromBody] RecipeDTO recipeDTO)
        {
            try
            {
                await _recipeService.InsertRecipeAsync(recipeDTO);
                return Ok("Recipe inserted successfully");
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("search")]
        public async Task<IActionResult> SearchRecipesAsync([FromQuery] string query)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty.");
            }

            var recipes = await _recipeService.SearchRecipesAsync(query);
            return Ok(recipes);
        }
    }
}
