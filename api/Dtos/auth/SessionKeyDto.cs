
using System.ComponentModel.DataAnnotations;

namespace api.Dtos.auth
{
    public class SessionKeyDto
    {
        [Required]
        public string SessionKey { get; set; } = string.Empty;
    }
}