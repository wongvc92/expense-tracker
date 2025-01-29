using System.Text;
using System.Text.Json;
using api.interfaces;
using Microsoft.Extensions.Options;
namespace api.Services;

public class ResendSettings
{
    public string ApiKey { get; set; } = string.Empty;
    public string SenderEmail { get; set; } = string.Empty;
}

public class ResendEmailSender : IEmailSender
{
    private readonly HttpClient _httpClient;
    private readonly ResendSettings _settings;

    public ResendEmailSender(HttpClient httpClient, IOptions<ResendSettings> settings)
    {
        _httpClient = httpClient;
        _settings = settings.Value;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlContent)
    {
        var payload = new
        {
            from = _settings.SenderEmail,
            to = toEmail,
            subject,
            html = htmlContent
        };

        var jsonPayload = JsonSerializer.Serialize(payload);
        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

        var request = new HttpRequestMessage(HttpMethod.Post, "https://api.resend.com/emails")
        {
            Headers = { { "Authorization", $"Bearer {_settings.ApiKey}" } },
            Content = content
        };

        var response = await _httpClient.SendAsync(request);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Failed to send email: {errorContent}");
        }
    }
}
