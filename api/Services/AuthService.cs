using System.Collections;
using api.Data;
using api.Dtos.auth;
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

        public async Task<string?> CreateNewAccount(ApplicationUser? user, string? googleId, string? profileImage, string? email)
        {
            user = new ApplicationUser
            {
                ProfileImage = profileImage,
                UserName = email,
                Email = email,
                GoogleId = googleId,
                EmailConfirmed = true // Automatically confirm email for Google users
            };

            var createResult = await _userManager.CreateAsync(user);
            if (!createResult.Succeeded)
            {
                var firstError = createResult.Errors.FirstOrDefault()?.Description;

                return firstError;
            }
            return null;
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

        public async Task<string?> LinkGoogleAccountToExisingAccount(ApplicationUser user, string? googleId, string? profileImage)
        {
            // Link the Google ID to the existing account
            user.GoogleId = googleId;
            user.EmailConfirmed = true; // Explicitly set EmailConfirmed to true
            user.ProfileImage = profileImage;
            var updateResult = await _userManager.UpdateAsync(user);


            if (!updateResult.Succeeded)
            {
                var firstError = updateResult.Errors.FirstOrDefault()?.Description;
                return firstError;
            }
            return null;
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

        public async Task SendResetPasswordEmail(ApplicationUser user, string token)
        {
            // Generate password reset token


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

        public async Task<string?> UpdateEmail(SettingsRequestDto body, ApplicationUser user)
        {
            if (string.IsNullOrEmpty(body.Email))
            {
                return "New email is required.";
            }
            if (await _userManager.FindByEmailAsync(body.Email) != null)
            {
                return "Email is already in use by another account.";
            }

            // Set PendingEmail
            user.PendingEmail = body.Email;
            var updateResult = await _userManager.UpdateAsync(user);

            if (!updateResult.Succeeded)
            {
                return "Failed to update user settings.";
            }
            return null;
        }

        public async Task<string?> UpdatePassword(SettingsRequestDto body, ApplicationUser user)
        {

            var isOldPasswordValid = await _userManager.CheckPasswordAsync(user, body.OldPassword!);
            if (!isOldPasswordValid)
            {
                return "Old password is incorrect.";
            }

            var changePasswordResult = await _userManager.ChangePasswordAsync(user, body.OldPassword!, body.NewPassword!);
            if (!changePasswordResult.Succeeded)
            {
                var firstError = changePasswordResult.Errors
                    .Select(e => e.Description)
                    .FirstOrDefault();
                return firstError;
            }
            return null;
        }

        public async Task<string?> UpdateTwoFactor(SettingsRequestDto body, ApplicationUser user)
        {
            if (body.TwoFactorEnabled == true)
            {
                // Enable 2FA for the user
                user.TwoFactorEnabled = true;
                await _userManager.UpdateAsync(user);

                return "Two-factor authentication enabled successfully";
            }
            else
            {
                // Disable 2FA for the user
                user.TwoFactorEnabled = false;
                await _userManager.UpdateAsync(user);

                return "Two-factor authentication disabled successfully.";
            }

        }

        public async Task<string?> UpdateUsername(SettingsRequestDto body, ApplicationUser user)
        {
            var existingUsername = await _userManager.FindByNameAsync(body.UserName!);
            if (existingUsername != null)
            {
                return $"username with {body.UserName!} already exist";
            }

            user.UserName = body.UserName;

            var updateResult = await _userManager.UpdateAsync(user);
            if (!updateResult.Succeeded)
            {
                return $"Failed to update user settings. {updateResult.Errors}";
            }

            return null;
        }
    }
}