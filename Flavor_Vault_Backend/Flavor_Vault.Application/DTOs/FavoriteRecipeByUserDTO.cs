namespace Flavor_Vault.Application.DTOs
{
    public class FavoriteRecipeByUserDTO
    {
        public int Id { get; set; }
        public int RecipeId { get; set; }
        public string Title { get; set; }
        public string[] Body { get; set; }
        public string ImageUrl { get; set; }
        public bool IsLiked { get; set; }
    }
}
