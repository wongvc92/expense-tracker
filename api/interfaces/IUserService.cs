using System.Security.Claims;
using api.Models;

namespace api.interfaces
{
    public interface IUserService
    {
        public Task<ApplicationUser?> GetAuthenticatedUserAsync(ClaimsPrincipal user);
    }
}