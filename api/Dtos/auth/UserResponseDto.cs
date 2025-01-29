namespace api.Dtos.auth
{
    public class UserResponseDto
    {
        public decimal Balance { get; set; }
        public decimal TotalIncome { get; set; }
        public string Id { get; set; } = string.Empty;
        public string? UserName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool TwoFactorEnabled { get; set; } = false;
        public string? ProfileImage { get; set; } = string.Empty;

    }
}