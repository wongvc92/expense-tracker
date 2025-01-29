
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.auth
{
    public class VerifyEmailDto
    {
        [Required]
        public required string UserId { get; set; }

        [Required]
        public required string Token { get; set; }
    }
}