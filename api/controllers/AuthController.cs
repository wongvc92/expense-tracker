using System.Security.Claims;
using api.Data;
using api.Dtos.auth;
using api.Exceptions;
using api.interfaces;
using api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace api.controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IEmailSender emailSender, AppDbContext dbContext, IAuthService authService) : ControllerBase
    {
        private readonly IAuthService _authService = authService;
        private readonly AppDbContext _dbContext = dbContext;
        private readonly UserManager<ApplicationUser> _userManager = userManager;
        private readonly RoleManager<IdentityRole> _roleManager = roleManager;
        private readonly SignInManager<ApplicationUser> _signInManager = signInManager;
        private readonly IConfiguration _configuration = configuration;
        private readonly IEmailSender _emailSender = emailSender;



        [Authorize]
        [HttpGet("sessions")]
        public async Task<ActionResult> GetActiveSessions()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not logged in." });
            }

            var sessions = await _authService.GetActiveSessions(userId);
            return Ok(sessions);
        }

        [Authorize]
        [HttpPost("logout-device")]
        public async Task<IActionResult> LogoutSpecificSession([FromBody] SessionKeyDto body)
        {
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            if (string.IsNullOrEmpty(body.SessionKey))
            {
                return BadRequest(new { message = "Session key is required." });
            }

            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { message = "User not logged in." });
            }

            var session = await _dbContext.UserSessions
                .FirstOrDefaultAsync(s => s.UserId.ToString() == userId && s.SessionKey == body.SessionKey);

            if (session == null)
            {
                return NotFound(new { message = "Session not found." });
            }

            // Revoke the session
            session.IsRevoked = true;
            await _dbContext.SaveChangesAsync();

            // Sign out the user
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);

            // Delete cookies manually
            HttpContext.Response.Cookies.Delete(".AspNetCore.Identity.Application");
            HttpContext.Response.Cookies.Delete("SessionKey");

            return Ok(new { message = "Session revoked successfully." });
        }



        [HttpGet("google-login")]
        public async Task LoginWithGoogle()
        {
            await HttpContext.ChallengeAsync(GoogleDefaults.AuthenticationScheme,
            new AuthenticationProperties
            {
                RedirectUri = Url.Action("GoogleResponse")
            });
        }


        public async Task<IActionResult> GoogleResponse()
        {
            var result = await HttpContext.AuthenticateAsync(GoogleDefaults.AuthenticationScheme);

            if (!result.Succeeded || result.Principal == null)
            {
                Console.WriteLine("Google authentication failed. Result was not successful.");
                return BadRequest(new { message = "Google authentication failed." });
            }

            var claims = result.Principal.Identities.FirstOrDefault()?.Claims
                .Select(c => new { c.Type, c.Value });

            if (claims == null)
            {
                Console.WriteLine("No claims found.");
                return BadRequest(new { message = "No claims found in the Google authentication response." });
            }

            var googleId = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;
            var email = claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value;
            var profileImage = claims.FirstOrDefault(c => c.Type == "picture")?.Value ?? null;

            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new { message = "Email is required." });
            }

            // Check if a user exists with the Google ID
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.GoogleId == googleId);

            if (user == null)
            {
                // Check if a user exists with the email
                user = await _userManager.FindByEmailAsync(email);

                if (user != null)
                {
                    var error = await _authService.LinkGoogleAccountToExisingAccount(user, googleId, profileImage);
                    if (error != null) return BadRequest(new { message = error ?? "Failed to link Google ID to the user." });
                }
                else
                {
                    var error = await _authService.CreateNewAccount(user, googleId, profileImage, email);
                    return BadRequest(new { message = error ?? "Failed to create user." });
                }
            }

            // Sign in the user
            await _signInManager.SignInAsync(user, isPersistent: false);

            string redirectUrl = _configuration["FrontendUrl"]!;
            return Redirect(redirectUrl);
        }



        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto body)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    var firstError = ModelState.Values
                        .SelectMany(v => v.Errors)
                        .Select(e => e.ErrorMessage)
                        .FirstOrDefault();
                    return BadRequest(new { message = firstError });
                }

                var user = await _userManager.FindByEmailAsync(body.Email);
                if (user == null)
                {
                    return Unauthorized(new { message = "Invalid credentials (Email)." });
                }

                // Check if email is confirmed
                if (!user.EmailConfirmed)
                {
                    return Unauthorized(new { message = "Email confirmation is required." });
                }

                // Check if Two-Factor Authentication is enabled
                if (user.TwoFactorEnabled)
                {
                    // If a 2FA token is provided, verify it first
                    if (!string.IsNullOrEmpty(body.Token))
                    {
                        var isTokenValid = await _userManager.VerifyTwoFactorTokenAsync(user, "Email", body.Token);
                        if (isTokenValid)
                        {
                            // Token is valid, sign in the user and stop the flow
                            await _signInManager.SignInAsync(user, isPersistent: false);
                            return Ok(new { isAuthenticated = true });
                        }
                        return Unauthorized(new { message = "Invalid 2FA token." });
                    }


                    var twoFactorToken = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
                    await _emailSender.SendEmailAsync(user.Email!, "Two-Factor Authentication Code", $"Your 2FA code is: {twoFactorToken}");

                    return Ok(new { twoFactor = true, message = "Two-factor authentication is required. Check your email for the token." });
                }


                // For users without 2FA enabled, perform regular sign-in
                var result = await _signInManager.PasswordSignInAsync(user, body.Password, body.isRememberMe, false);

                if (result.IsLockedOut)
                {
                    Console.WriteLine("Login failed: Account is locked.");
                    return Unauthorized(new { message = "Your account is locked. Please try again later." });
                }

                if (!result.Succeeded)
                {
                    Console.WriteLine("Login failed: Invalid credentials.");
                    return Unauthorized(new { message = "Invalid credentials." });
                }

                // Login successful
                Console.WriteLine("Login successful.");
                return Ok(new { isAuthenticated = true });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error during login: {ex.Message}");
                return BadRequest(new { message = "An error occurred during login. Please try again." });
            }
        }


        [Authorize]
        [HttpPost("settings")]
        public async Task<ActionResult> ChangeSettings(SettingsRequestDto body)
        {
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            var user = await _userManager.GetUserAsync(User);

            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            if (body.UserName != user.UserName)
            {
                var error = await _authService.UpdateUsername(body, user);
                if (error != null) return BadRequest(new { message = error });
                return Ok(new { message = "username has been updated" });
            }

            if (!string.IsNullOrEmpty(body.Email) && body.Email != user.Email)
            {
                var error = await _authService.UpdateEmail(body, user);
                if (error != null) return BadRequest(new { message = error });
                await _authService.SendChangeEmailEmail(user, body.Email);
                return Ok(new { message = "A confirmation link has been sent to your new email address. Please verify it to update your email." });
            }

            if (!string.IsNullOrEmpty(body.NewPassword) && !string.IsNullOrEmpty(body.OldPassword))
            {
                var error = await _authService.UpdatePassword(body, user);
                if (error != null) return BadRequest(new { message = error });
                return Ok(new { message = "Password updated successfully." });
            }

            if (body.TwoFactorEnabled != user.TwoFactorEnabled)
            {
                var successMessage = await _authService.UpdateTwoFactor(body, user);
                return Ok(new { message = successMessage });
            }

            return Ok(new { message = "Settings updated." });
        }

        [HttpPost("register")]
        public async Task<ActionResult> Register([FromBody] RegisterDto dto)
        {

            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage).FirstOrDefault();
                throw new AppException(firstError ?? "Failed to register user.");
            }

            var user = new ApplicationUser { UserName = dto.Email, Email = dto.Email };

            var result = await _userManager.CreateAsync(user, dto.Password);
            if (!result.Succeeded)
            {
                var firstError = result.Errors.Select(e => e.Description).FirstOrDefault();
                throw new AppException(firstError ?? "Email is already taken.");
            }

            await _authService.SendRegisterEmail(user);
            return Ok(new { message = "User registered successfully. Please check your email to confirm your account." });
        }



        [Authorize]
        [HttpPost("enable-2fa")]
        public async Task<IActionResult> EnableTwoFactorAuthentication()
        {
            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var token = await _userManager.GenerateTwoFactorTokenAsync(user, "Email");
            user.TwoFactorEnabled = true;
            var result = await _userManager.UpdateAsync(user);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(e => e.Description).ToList();
                return BadRequest(new { message = "Failed to enable 2FA", errors });
            }

            // Send token via email
            var confirmationMessage = $"Your 2FA token is: {token}";
            await _emailSender.SendEmailAsync(user.Email!, "Enable Two-Factor Authentication", confirmationMessage);

            return Ok(new { message = "Two-factor authentication enabled. Check your email for the token." });
        }

        [HttpPost("verify-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] VerifyEmailDto body)
        {
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            var user = await _userManager.FindByIdAsync(body.UserId);
            if (user == null)
                return NotFound(new { message = "User not found." });

            var result = await _userManager.ConfirmEmailAsync(user, body.Token);
            if (!result.Succeeded)
            {
                foreach (var error in result.Errors)
                {
                    Console.WriteLine($"Code: {error.Code}, Description: {error.Description}");
                }
                return BadRequest(new { message = "Email confirmation failed." });
            }
            Console.WriteLine($"EmailConfirmed: {user.EmailConfirmed}");

            return Ok(new { message = "Email confirmed successfully." });
        }

        [Authorize]
        [HttpPost("verify-email-change")]
        public async Task<IActionResult> VerifyEmailChange([FromBody] VerifyEmailDto body)
        {
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                    .SelectMany(v => v.Errors)
                    .Select(e => e.ErrorMessage)
                    .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            var user = await _userManager.GetUserAsync(User);
            if (user == null)
            {
                return Unauthorized(new { message = "User not found." });
            }

            var isTokenValid = await _userManager.VerifyUserTokenAsync(user,
                TokenOptions.DefaultProvider,
                "EmailChange",
                body.Token);

            if (!isTokenValid)
            {
                return BadRequest(new { message = "Invalid or expired token." });
            }

            if (string.IsNullOrEmpty(user.PendingEmail))
            {
                return BadRequest(new { message = "No email change request found." });
            }

            // Update the email and clear PendingEmail
            user.Email = user.PendingEmail;
            user.PendingEmail = null;
            await _userManager.UpdateAsync(user);

            return Ok(new { message = "Email updated successfully. Please log in again to continue." });
        }




        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ForgotPasswordDto body)
        {

            // Validate the request
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            // Find the user by email
            var user = await _userManager.FindByEmailAsync(body.Email);
            if (user == null)
                return BadRequest(new { message = "User not found." });

            // Ensure email is not null
            if (string.IsNullOrEmpty(user.Email))
                return BadRequest(new { message = "User email is invalid or not set." });
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            await _authService.SendResetPasswordEmail(user, token);
            return Ok(new { message = "Password reset link has been sent to your email." });
        }

        [HttpPost("new-password")]
        public async Task<IActionResult> NewPassword(ResetPasswordModel model)
        {
            // Validate the request
            if (!ModelState.IsValid)
            {
                var firstError = ModelState.Values
                .SelectMany(v => v.Errors)
                .Select(e => e.ErrorMessage)
                .FirstOrDefault();
                return BadRequest(new { message = firstError });
            }

            // Find the user by ID
            var user = await _userManager.FindByIdAsync(model.UserId);
            if (user == null)
            {
                return BadRequest(new { message = "Invalid user ID." });
            }

            // Attempt to reset the password
            var result = await _userManager.ResetPasswordAsync(user, model.Token, model.NewPassword);
            if (!result.Succeeded)
            {
                // Get the first identity error message
                var firstError = result.Errors
                    .Select(e => e.Description)
                    .FirstOrDefault();

                return BadRequest(new { message = firstError });
            }

            return Ok(new { message = "Password has been reset successfully." });
        }


        [Authorize]
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync(IdentityConstants.ApplicationScheme);
            return Ok(new { message = "Logged out successfully" });
        }


        [HttpPost("assign-role")]
        public async Task<IActionResult> AssignRole(string userId, string role)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "user not found" });
            }

            if (!await _roleManager.RoleExistsAsync(role))
            {
                await _roleManager.CreateAsync(new IdentityRole(role));
            }

            var result = await _userManager.AddToRoleAsync(user, role);
            if (!result.Succeeded)
            {
                return BadRequest(new { message = "Failed to assign role." });
            }

            return Ok(new { message = "Role assinged successfully" });
        }

    }
}