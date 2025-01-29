using System.Diagnostics;
using api.Exceptions;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace api.middleware
{
    public class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
    {
        private readonly ILogger<GlobalExceptionHandler> _logger = logger;

        public async ValueTask<bool> TryHandleAsync(
            HttpContext httpContext,
            Exception exception,
            CancellationToken cancellationToken)
        {
            var traceId = Activity.Current?.Id ?? httpContext.TraceIdentifier;
            _logger.LogError(
                exception,
                "Could not process a request on machine {MachineName}. TraceId: {TraceId}",
                Environment.MachineName,
                traceId
            );

            var (statusCode, title) = MapException(exception);
            await Results.Problem(
                title: title,
                statusCode: statusCode,
                extensions: new Dictionary<string, object?>
                {
                    { "traceId", traceId }
                }
            ).ExecuteAsync(httpContext);

            return true;
        }

        private static (int StatusCode, string Title) MapException(Exception exception)
        {
            return exception switch
            {
                AppException => (StatusCodes.Status400BadRequest, exception.Message),
                DbUpdateException dbEx when dbEx.InnerException?.Message.Contains("IX_AspNetUsers_Email") ?? false =>
                    (StatusCodes.Status400BadRequest, "Email is already taken."),
                DbUpdateException dbEx when dbEx.InnerException?.Message.Contains("IX_AspNetUsers_UserName") ?? false =>
                    (StatusCodes.Status400BadRequest, "Username is already taken."),
                ArgumentOutOfRangeException => (StatusCodes.Status400BadRequest, exception.Message),
                _ => (StatusCodes.Status500InternalServerError, "An unexpected error occurred.")
            };
        }
    }
}