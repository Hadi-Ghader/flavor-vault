using Flavor_Vault.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Flavor_Vault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FavoriteController : Controller
    {
        private readonly IFavoriteService _favoriteService;

        public FavoriteController(IFavoriteService favoriteService)
        {
            _favoriteService = favoriteService;
        }

        [HttpPost("getfavoritesbyuser")]
        public async Task<ActionResult> GetFavoritesForUserAsync([FromBody] int id) 
        {
            var favorites = await _favoriteService.GetFavoritesForUserAsync(id);

            return Ok(favorites);
        }
    }
}
