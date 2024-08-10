namespace Flavor_Vault.Application.DTOs
{
    public class CommentWithoutIdDTO
    {
        public string Body { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
    }
}
