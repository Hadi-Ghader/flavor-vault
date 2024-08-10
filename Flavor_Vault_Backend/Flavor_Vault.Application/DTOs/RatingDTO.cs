namespace Flavor_Vault.Application.DTOs
{
    public class RatingDTO
    {
        public int Id { get; set; }
        public int StarsCount { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
    }
}
