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

        [HttpGet("getFavoritesByUser")]
        public async Task<IActionResult> GetFavoritesForUserAsync(int id)
        {
            if (id <= 0)
            {
                return BadRequest(new { Message = "Id can not be less than or equal to 0" });
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
    }
}
