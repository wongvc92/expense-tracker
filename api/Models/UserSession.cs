namespace api.Models
{
    public class UserSession
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string SessionKey { get; set; } = string.Empty;
        public string UserAgent { get; set; } = string.Empty;
        public string IPAddress { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; } = false;
    }
}