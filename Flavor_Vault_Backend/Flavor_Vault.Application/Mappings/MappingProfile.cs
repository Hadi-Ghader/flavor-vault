using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserSignUpDTO, User>().ReverseMap();
            CreateMap<RecipeDTO, Recipe>().ReverseMap();
            CreateMap<CategoryDTO, Category>().ReverseMap();
            CreateMap<FavoriteRecipeByUserDTO, FavoriteRecipeByUser>().ReverseMap();
            CreateMap<LikeDTO, Like>().ReverseMap();
        }
    }
}
