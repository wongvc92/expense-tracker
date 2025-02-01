

using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class Income
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;

        [Precision(18, 2)]
        public decimal Amount { get; set; }
        public string Source { get; set; } = "Other"; // Salary, Bonus, etc.
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public ApplicationUser? User { get; set; }
        public ICollection<Transaction>? Transactions { get; set; }
    }
}