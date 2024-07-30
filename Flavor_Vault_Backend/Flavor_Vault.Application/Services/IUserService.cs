using Flavor_Vault.Application.DTOs;

namespace Flavor_Vault.Application.Services
{
    public interface IUserService
    {
        public Task<string> UserSignUpAsync(UserSignUpDTO userDTO);
        public Task ValidateUserAsync(UserSignUpDTO userDTO);
        public Task<string> UserLoginAsync(UserLoginDTO userLoginDTO);
    }
}
