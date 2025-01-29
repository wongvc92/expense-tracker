
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.auth
{
    public class ForgotPasswordDto
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
    }
}