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
            CreateMap<Recipe, RecipeDTO>()
                .ForMember(dest => dest.IsLiked, opt => opt.Ignore());
            CreateMap<RecipeDTO, Recipe>();
            CreateMap<CategoryDTO, Category>().ReverseMap();
            CreateMap<FavoriteRecipeByUserDTO, FavoriteRecipeByUser>().ReverseMap()
                .ForMember(dest => dest.IsLiked, opt => opt.Ignore());
            CreateMap<LikeDTO, Like>().ReverseMap();
            CreateMap<FavoriteDTO, Favorite>().ReverseMap();
        }
    }
}
