
using System.Collections;
using api.Dtos.auth;
using api.Models;



namespace api.interfaces
{
    public interface IAuthService
    {
        Task<string?> UpdateTwoFactor(SettingsRequestDto body, ApplicationUser user);
        Task<string?> UpdatePassword(SettingsRequestDto body, ApplicationUser user);
        Task<string?> UpdateEmail(SettingsRequestDto body, ApplicationUser user);
        Task<string?> UpdateUsername(SettingsRequestDto body, ApplicationUser user);
        Task<string?> LinkGoogleAccountToExisingAccount(ApplicationUser user, string? googleId, string? profileImage);
        Task<string?> CreateNewAccount(ApplicationUser? user, string? googleId, string? profileImage, string? email);
        Task<IEnumerable> GetActiveSessions(string userId);
        Task SendRegisterEmail(ApplicationUser user);
        Task SendChangeEmailEmail(ApplicationUser user, string email);
        Task SendResetPasswordEmail(ApplicationUser user, string token);
        Task AssignRole(string userId, string role);
    }
}