namespace api.Dtos.auth
{
    public class SettingsRequestDto
    {
        public string? UserName { get; set; }
        public string? Email { get; set; }
        public string? Password { get; set; }
        public bool? TwoFactorEnabled { get; set; }
        public string? NewPassword { get; set; }
        public string? OldPassword { get; set; }

    }
}