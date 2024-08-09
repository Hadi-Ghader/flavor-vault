namespace Flavor_Vault.Core.Entities
{
    public class CommentsWithUser
    {
        public int Id { get; set; }
        public string Body { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
        public string name { get; set; }
    }
}
