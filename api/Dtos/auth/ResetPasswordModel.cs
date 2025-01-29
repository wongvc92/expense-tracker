
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.auth
{
    public class ResetPasswordModel
    {
        [Required]
        public string NewPassword { get; set; } = string.Empty;

        [Required]
        public string Token { get; set; } = string.Empty;

        [Required]
        public string UserId { get; set; } = string.Empty;


    }
}