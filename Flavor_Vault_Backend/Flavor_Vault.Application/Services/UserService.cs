using AutoMapper;
using Flavor_Vault.Application.DTOs;
using Flavor_Vault.Core.Entities;
using Flavor_Vault.Infrastructure.Repositories;

namespace Flavor_Vault.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IMapper _userMapper;
        private readonly JwtTokenGenerator _jwtTokenGenerator;

        public UserService(IUserRepository userRepository, IMapper userMapper, JwtTokenGenerator jwtTokenGenerator)
        {
            _userRepository = userRepository;
            _userMapper = userMapper;
            _jwtTokenGenerator = jwtTokenGenerator;
        }

        public async Task ValidateUserAsync(UserSignUpDTO userDTO)
        {
            if (string.IsNullOrWhiteSpace(userDTO.Email))
            {
                throw new ArgumentException("Email is required");
            }

            if (string.IsNullOrWhiteSpace(userDTO.Password))
            {
                throw new ArgumentException("Password is required");
            }

            if (string.IsNullOrWhiteSpace(userDTO.Name))
            {
                throw new ArgumentException("Name is required");
            }

            bool emailExists = await _userRepository.EmailExistsAsync(userDTO.Email);
            if (emailExists)
            {
                throw new InvalidOperationException("A user with this email already exists try loggin in");
            }
        }

        public async Task<string> UserSignUpAsync(UserSignUpDTO useSignUpDTO)
        {
            var user = _userMapper.Map<User>(useSignUpDTO);

            user.SetPassword(useSignUpDTO.Password);

            try
            {
                await _userRepository.UserSignUpAsync(user);
                var token = _jwtTokenGenerator.GenerateToken(user.Email);
                return token;
            }
            catch (Exception exception)
            {
                throw new Exception("An error occurred while registering the user", exception);
            }
        }

        public async Task<string> UserLoginAsync(UserLoginDTO userLoginDTO)
        {
            var user = await _userRepository.GetUserByEmailAsync(userLoginDTO.Email);
            user.SetPassword(userLoginDTO.Password);

            if (user == null || !user.CheckPassword(userLoginDTO.Password))
            {
                throw new UnauthorizedAccessException("Invalid credentials");
            }
            var token = _jwtTokenGenerator.GenerateToken(user.Email);
            return token;
        }
    }
}
