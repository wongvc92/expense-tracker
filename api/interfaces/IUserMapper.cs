using api.Dtos.auth;
using api.Models;

namespace api.interfaces
{
    public interface IUserMapper
    {
        ApplicationUser MapToUser(RegisterDto dto);
        UserResponseDto MapToUserResponse(ApplicationUser user);
    }
}