using System.Collections;
using api.Data;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
namespace api.Services
{
    public class AuthService(AppDbContext dbContext, IEmailSender emailSender, UserManager<ApplicationUser> userManager, IConfiguration configuration) : IAuthService
    {
        private readonly IConfiguration _configuration = configuration;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly IEmailSender _emailSender = emailSender;

        public Task AssignRole(string userId, string role)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable> GetActiveSessions(string userId)
        {
            var sessions = await _dbContext.UserSessions
            .Where(s => s.UserId.ToString() == userId && !s.IsRevoked && s.ExpiresAt > DateTime.UtcNow)
            .Select(s => new
            {
                s.Id,
                s.SessionKey,
                s.UserAgent,
                s.IPAddress,
                s.CreatedAt,
                s.ExpiresAt,
                s.IsRevoked
            })
            .ToListAsync();
            return sessions;
        }

        public async Task SendChangeEmailEmail(ApplicationUser user, string email)
        {
            var token = await _userManager.GenerateUserTokenAsync(user,
       TokenOptions.DefaultProvider, "EmailChange");
            var frontendUrl = _configuration["FrontendUrl"];
            var confirmationLink = $"{frontendUrl}/auth/verify-email-change?userId={user.Id}&token={Uri.EscapeDataString(token)}";

            Console.WriteLine($"Generated Confirmation Link: {confirmationLink}");

            // Send email
            var message = $@"
            <html>
            <body>
                <p>Click the link below to verify your email:</p>
                <p><a href='{confirmationLink}'>Verify Email</a></p>
                <p>If the link doesn't work, copy and paste the following URL into your browser:</p>
                <p>{confirmationLink}</p>
            </body>
            </html>";

            await _emailSender.SendEmailAsync(email, "Email Confirmation", message); throw new NotImplementedException();
        }

        public async Task SendRegisterEmail(ApplicationUser user)
        {

            // Generate email confirmation token
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var frontendUrl = _configuration["FrontendUrl"];
            var confirmationLink = $"{frontendUrl}/auth/verify-email?userId={user.Id}&token={Uri.EscapeDataString(token)}";

            var message = $@"
            <html>
            <body>
                <p>Click the link below to verify your email:</p>
                <p><a href='{confirmationLink}'>Verify Email</a></p>
                <p>If the link doesn't work, copy and paste the following URL into your browser:</p>
                <p>{confirmationLink}</p>
            </body>
            </html>";

            await _emailSender.SendEmailAsync(user.Email!, "Email Confirmation", message);
        }

        public async Task SendResetPasswordEmail(ApplicationUser user)
        {
            // Generate password reset token
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);

            // Create the reset link
            var resetLink = $"{_configuration["FrontendUrl"]}/auth/new-password?userId={user.Id}&token={Uri.EscapeDataString(token)}";

            // Send the email
            var message = $@"
            <html>
            <body>
                <p>Click the link below to reset your password:</p>
                <p><a href='{resetLink}'>Reset Password</a></p>
                <p>If the link doesn't work, copy and paste the following URL into your browser:</p>
                <p>{resetLink}</p>
            </body>
            </html>";

            await _emailSender.SendEmailAsync(user.Email!, "Password Reset Request", message);
        }
    }
}