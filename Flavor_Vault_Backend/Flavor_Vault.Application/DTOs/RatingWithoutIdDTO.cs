namespace Flavor_Vault.Application.DTOs
{
    public class RatingWithoutIdDTO
    {
        public int StarsCount { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
    }
}
