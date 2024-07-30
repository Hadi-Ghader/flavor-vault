using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface ICategoryService
    {
        public Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync();
    }
}
