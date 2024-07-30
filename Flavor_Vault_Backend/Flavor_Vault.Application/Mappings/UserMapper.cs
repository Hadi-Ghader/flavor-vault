using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Application.Mappings
{
    public class UserMapper : Profile
    {
        public UserMapper()
        {
            CreateMap<UserSignUpDTO, User>().ReverseMap();
        }
    }
}
