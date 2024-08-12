using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Application.Services;
using Flavor_Vault.Core.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace Flavor_Vault.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class RecipeInteractionController : Controller
    {
        private readonly ILikeService _likeService;
        private readonly ICommentService _commentService;
        private readonly IRatingService _ratingService;

        public RecipeInteractionController(ILikeService likeService, ICommentService commentService, IRatingService ratingService)
        {
            _likeService = likeService;
            _commentService = commentService;
            _ratingService = ratingService;
        }

        [HttpGet("userHasLiked")]
        public async Task<IActionResult> UserHasLikedAsync(int userId, int recipeId)
        {
            try
            {
                if (userId <= 0 || recipeId <= 0)
                {
                    return BadRequest("Invalid like data.");
                }

                var result = await _likeService.UserHasLikedAsync(userId, recipeId);
                return Ok(result);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("getRecipesWithLikeStatus")]
        public async Task<IActionResult> GetRecipesWithLikeStatusAsync(int userId)
        {
            try
            {
                if (userId <= 0)
                {
                    return BadRequest("Invalid like data.");
                }

                var result = await _likeService.GetRecipesWithLikeStatusAsync(userId);
                return Ok(result);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("getComments")]
        public async Task<IActionResult> GetPaginatedCommentsAsync(int page = 1, int pageSize = 5)
        {
            try
            {
                var (comments, totalCount) = await _commentService.GetPaginatedCommentsAsync(page, pageSize);

                return Ok(new
                {
                    Comments = comments,
                    TotalCount = totalCount
                });
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpPost("addLike")]
        public async Task<IActionResult> AddLikeAsync([FromBody] LikeDTO likeDTO)
        {
            try
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
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpPost("addComment")]
        public async Task<IActionResult> AddCommentAsync([FromBody] CommentWithoutIdDTO commentWithoutDTO)
        {
            try
            {
                if (commentWithoutDTO == null || string.IsNullOrWhiteSpace(commentWithoutDTO.Body))
                {
                    return BadRequest("Invalid comment data.");
                }

                await _commentService.AddCommentAsync(commentWithoutDTO);
                return Ok("Comment added");
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpDelete("removeLike")]
        public async Task<IActionResult> DeleteLikeAsync(int userId, int recipeId)
        {
            try
            {
                if (userId <= 0 || recipeId <= 0)
                {
                    return BadRequest("Invalid like data.");
                }

                await _likeService.DeleteLikeAsync(userId, recipeId);
                return Ok("Like Deleted");
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpDelete("removeComment")]
        public async Task<IActionResult> DeleteCommentAsync(int id)
        {
            try
            {
                if (id <= 0)
                {
                    return BadRequest("Invalid comment data.");
                }

                await _commentService.DeleteCommentAsync(id);
                return Ok("Comment Deleted");

            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpPost("addRating")]
        public async Task<IActionResult> AddRatingAsync([FromBody] RatingWithoutIdDTO ratingDto)
        {
            try
            {
                if (ratingDto == null || ratingDto.UserId <= 0 || ratingDto.RecipeId <= 0 || ratingDto.StarsCount <= 0)
                {
                    return BadRequest("Invalid rating data.");
                }

                var success = await _ratingService.SubmitRatingAsync(ratingDto);
                if (!success)
                {
                    return BadRequest("You have already rated this recipe.");
                }
                return Ok("Rating added successfully.");
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpGet("userHasRated")]
        public async Task<IActionResult> HasUserRatedAsync(int userId, int recipeId)
        {
            try
            {
                var hasRated = await _ratingService.HasUserRatedAsync(userId, recipeId);
                return Ok(hasRated);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [HttpGet("averageRating")]
        public async Task<IActionResult> GetAverageRatingAsync(int recipeId)
        {
            try
            {
                var averageRating = await _ratingService.GetAverageRatingAsync(recipeId);
                return Ok(averageRating);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }

        [Authorize]
        [HttpGet("getUserRatingForRecipe")]
        public async Task<IActionResult> GetRatingByUserForRecipeAsync(int userId, int recipeId)
        {
            try
            {
                var starsCount = await _ratingService.GetAverageRatingAsyncCountAsync(userId, recipeId);
                return Ok(starsCount);
            }
            catch (Exception exception)
            {
                return StatusCode(500, new { Message = "An error occurred while processing your request.", Details = exception.Message });
            }
        }
    }
}
