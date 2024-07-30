using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Application.Services;
using Microsoft.AspNetCore.Mvc;

namespace Flavor_Vault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : Controller
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("SignUp")]
        public async Task<IActionResult> UserSignUpAsync([FromBody] UserSignUpDTO useSignUpDTO)
        {
            if (useSignUpDTO == null)
            {
                return BadRequest(new { Message = "User is required." });
            }
            try
            {
                await _userService.ValidateUserAsync(useSignUpDTO);
                var token = await _userService.UserSignUpAsync(useSignUpDTO);
                return Ok(new { Message = "User created successfully", Token = token });
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpPost("Login")]
        public async Task<IActionResult> UserLoginAsync([FromBody] UserLoginDTO userLoginDTO)
        {
            try
            {
                var token = await _userService.UserLoginAsync(userLoginDTO);
                return Ok(new { Message = "User is authenticated", Token = token });
            }
            catch (Exception exception) 
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }
    }
}
