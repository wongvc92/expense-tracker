using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class ApplicationUser : IdentityUser
    {
        [Precision(18, 2)]
        public decimal Balance { get; set; } = 0.00m;
        [Precision(18, 2)]
        public decimal TotalIncome { get; set; } = 0.00m;
        public string Role { get; set; } = "user";
        public string? PendingEmail { get; set; }
        public string? GoogleId { get; set; }
        public string? ProfileImage { get; set; }
    }
}