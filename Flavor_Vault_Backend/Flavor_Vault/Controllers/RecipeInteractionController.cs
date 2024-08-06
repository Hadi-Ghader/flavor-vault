using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Flavor_Vault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeInteractionController : Controller
    {
        private readonly ILikeService _likeService;
        public RecipeInteractionController(ILikeService likeService)
        {
            _likeService = likeService;
        }

        [HttpGet("userHasLiked")]
        public async Task<IActionResult> UserHasLikedAsync(int userId, int recipeId)
        {
            if (userId <= 0 || recipeId <= 0)
            {
                return BadRequest("Invalid like data.");
            }

            var result = await _likeService.UserHasLikedAsync(userId, recipeId);

            return Ok(result);
        }

        [HttpPost("addLike")]
        public async Task<IActionResult> AddLikeAsync([FromBody] LikeDTO likeDTO)
        {
            if (likeDTO == null || likeDTO.UserId <= 0 || likeDTO.RecipeId <= 0)
            {
                return BadRequest("Invalid like data.");
            }

            var result = await _likeService.AddLikeAsync(likeDTO);

            if (!result)
            {
                return Conflict("You have already liked this recipe.");
            }

            return Ok("Recipe liked successfully.");
        }

        [HttpDelete("removeLike")]
        public async Task<IActionResult> DeleteLikeAsync(int userId, int recipeId)
        {
            if (userId <= 0 || recipeId <= 0)
            {
                return BadRequest("Invalid like data.");
            }

            await _likeService.DeleteLikeAsync(userId, recipeId);

            return Ok("Like Deleted");
        }
    }
}
