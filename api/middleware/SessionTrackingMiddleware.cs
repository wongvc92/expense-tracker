using System.Security.Claims;
using api.Data;
using api.Models;
using Microsoft.AspNetCore.Authentication;

using Microsoft.EntityFrameworkCore;

namespace api.middleware
{
    public class SessionTrackingMiddleware
    {
        private readonly RequestDelegate _next;

        public SessionTrackingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context, AppDbContext dbContext)
        {
            if (context.User.Identity?.IsAuthenticated == true)
            {
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

                if (!string.IsNullOrEmpty(userId))
                {
                    // Check if the session key exists in cookies
                    if (context.Request.Cookies.TryGetValue("SessionKey", out var sessionKey))
                    {
                        // Validate the session key
                        var session = await dbContext.UserSessions
                            .FirstOrDefaultAsync(s => s.SessionKey == sessionKey && s.UserId.ToString() == userId);

                        if (session == null || session.IsRevoked)
                        {
                            // If the session is invalid or revoked, log out the user
                            await context.SignOutAsync();
                            context.Response.Cookies.Delete("SessionKey");
                            return;
                        }

                        // Update the session expiration (sliding expiration)
                        session.ExpiresAt = DateTime.UtcNow.AddMinutes(60); // Sliding expiration
                        await dbContext.SaveChangesAsync();
                    }
                    else
                    {
                        // No session key found, generate a new one
                        var newSessionKey = Guid.NewGuid().ToString();

                        dbContext.UserSessions.Add(new UserSession
                        {
                            UserId = Guid.Parse(userId).ToString(),
                            SessionKey = newSessionKey,
                            UserAgent = context.Request.Headers.UserAgent.ToString(),
                            IPAddress = context.Connection.RemoteIpAddress?.ToString() ?? "",
                            CreatedAt = DateTime.UtcNow,
                            ExpiresAt = DateTime.UtcNow.AddMinutes(60) // Set expiration
                        });
                        await dbContext.SaveChangesAsync();

                        // Set session key in cookies
                        context.Response.Cookies.Append("SessionKey", newSessionKey, new CookieOptions
                        {
                            HttpOnly = true,
                            Secure = true,
                            Expires = DateTime.UtcNow.AddMinutes(60)
                        });
                    }
                }
            }

            await _next(context);
        }

    }
}