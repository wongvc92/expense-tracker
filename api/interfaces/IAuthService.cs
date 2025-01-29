
using System.Collections;
using api.Models;



namespace api.interfaces
{
    public interface IAuthService
    {
        Task<IEnumerable> GetActiveSessions(string userId);
        Task SendRegisterEmail(ApplicationUser user);
        Task SendChangeEmailEmail(ApplicationUser user, string email);
        Task SendResetPasswordEmail(ApplicationUser user);
        Task AssignRole(string userId, string role);
    }
}