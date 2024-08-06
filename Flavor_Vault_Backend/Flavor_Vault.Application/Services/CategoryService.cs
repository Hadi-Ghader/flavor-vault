using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ICategoryRepository _categoryRepository;
        private readonly IMapper _mapper;

        public CategoryService(ICategoryRepository categoryRepository, IMapper categoryMapper)
        {
            _categoryRepository = categoryRepository;
            _mapper = categoryMapper;
        }

        public async Task<IEnumerable<CategoryDTO>> GetAllCategoriesAsync()
        {
            var categories = await _categoryRepository.GetAllCategoriesAsync();
            var categoriesDTO = _mapper.Map<IEnumerable<CategoryDTO>>(categories);

            return categoriesDTO;
        }
    }
}
