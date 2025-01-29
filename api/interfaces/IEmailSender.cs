namespace api.interfaces
{
    public interface IEmailSender
    {
        Task SendEmailAsync(string toEmail, string subject, string htmlContent);
    }
}