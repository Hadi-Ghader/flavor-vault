namespace Flavor_Vault.Core.Entities
{
    public class Rating
    {
        public int Id { get; set; }
        public int StarsCount { get; set; }
        public int UserId { get; set; }
        public int RecipeId { get; set; }
    }
}
