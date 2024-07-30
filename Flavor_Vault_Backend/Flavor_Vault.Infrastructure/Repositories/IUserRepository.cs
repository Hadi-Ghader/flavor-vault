using Flavor_Vault.Core.Entities;

namespace Flavor_Vault.Infrastructure.Repositories
{
    public interface IUserRepository
    {
        public Task<bool> EmailExistsAsync(string email);
        public Task<User> GetUserByEmailAsync(string email);
        public Task<User> UserSignUpAsync(User user);

    }
}
