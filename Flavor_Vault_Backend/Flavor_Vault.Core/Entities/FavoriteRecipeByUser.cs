namespace Flavor_Vault.Core.Entities
{
    public class FavoriteRecipeByUser
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string Body { get; set; }
    }
}