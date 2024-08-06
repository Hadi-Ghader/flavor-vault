namespace Flavor_Vault.Core.Entities
{
    public class RecipeDTO
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string[] Body { get; set; }
        public int UserId{ get; set; }
        public int CategoryId { get; set; }
    }
}
