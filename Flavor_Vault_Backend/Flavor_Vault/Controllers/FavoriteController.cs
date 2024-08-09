using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Flavor_Vault.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController : Controller
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpGet("getUserFavoritesWithLikes")]
        public async Task<IActionResult> GetUserFavoritesWithLikesAsync(int userId)
        {
            if (userId <= 0)
            {
                return BadRequest("user Id can not be less than or equal to zero");
            }

            try
            {
                var favorites = await _favoriteService.GetUserFavoritesWithLikesAsync(userId);
                return Ok(favorites);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("getFavoritesByUser")]
        public async Task<IActionResult> GetFavoritesForUserAsync(int id)
        {
            if (id <= 0)
            {
                return BadRequest("user Id can not be less than or equal to zero");
            }

            try
            {
                var favorites = await _favoriteService.GetFavoritesForUserAsync(id);

                if (favorites == null)
                {
                    return NotFound("You don't have any favorites!");
                }

                return Ok(favorites);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("userHasFavorited")]
        public async Task<IActionResult> UserHasFavoritedAsync(int userId, int recipeId)
        {
            if (userId <= 0 || recipeId <= 0)
            {
                return BadRequest("Invalid favorite data.");
            }

            var result = await _favoriteService.UserHasFavoritedAsync(userId, recipeId);

            return Ok(result);
        }

        [HttpPost("addUserFavorite")]
        public async Task<IActionResult> InsertUserFavroiteAsync([FromBody] FavoriteDTO favoriteDTO)
        {
            if (favoriteDTO == null || favoriteDTO.UserId <= 0 || favoriteDTO.RecipeId <= 0)
            {
                return BadRequest("Invalid favorite data.");
            }

            var result = await _favoriteService.InsertUserFavroiteAsync(favoriteDTO);
            if (!result)
            {
                return Conflict("You have already added this recipe to your favorites.");
            }

            return Ok("Recipe liked successfully.");
        }

        [HttpDelete("removeFavorite")]
        public async Task<IActionResult> DeleteUserFavoriteAsync(int userId, int recipeId)
        {
            try {
                await _favoriteService.DeleteUserFavoriteAsync(userId, recipeId);
                return Ok("Favorite removed!");
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }
    }
}
