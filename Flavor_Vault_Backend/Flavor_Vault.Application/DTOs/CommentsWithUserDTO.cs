namespace Flavor_Vault.Application.DTOs
{
    public class CommentsWithUserDTO
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public string name { get; set; }
    }
}
