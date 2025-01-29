using api.Dtos.auth;

using api.Models;

namespace api.Mappers
{
    public static class UserMapper
    {
        public static ApplicationUser ToUser(this RegisterDto dto)
        {
            return new ApplicationUser
            {
                UserName = dto.UserName,
                Email = dto.Email
            };
        }

        public static UserResponseDto ToUserResponse(this ApplicationUser user)
        {
            return new UserResponseDto
            {
                Balance = user.Balance,
                TotalIncome = user.TotalIncome,
                Id = user.Id,
                UserName = user.UserName,
                Email = user.Email,
                Role = user.Role,
                TwoFactorEnabled = user.TwoFactorEnabled,
                ProfileImage = user.ProfileImage,
            };
        }
    }
}