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

        [HttpGet("GetAllLikes")]
        public async Task<IActionResult> GetAllLikesAsync(int id)
        { 
            if(id <= 0)
            {
                return BadRequest("Id can not be zero");
            }

            var likes = await _likeService.GetAllLikesAsync(id);
            return Ok(likes);
        }
    }
}
