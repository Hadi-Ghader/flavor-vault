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
    }
}
