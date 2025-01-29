

namespace api.Models
{
    public class Income
    {
        public Guid Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public decimal Amount { get; set; }
        public string Source { get; set; } = "Other"; // Salary, Bonus, etc.
        public DateTime Date { get; set; } = DateTime.UtcNow;

        public ApplicationUser? User { get; set; }
    }
}