using Microsoft.EntityFrameworkCore;

namespace api.Models
{
    public class Expense
    {
        public int Id { get; set; }
        public string UserId { get; set; } = string.Empty;

        [Precision(18, 2)]
        public decimal Amount { get; set; }
        public string Description { get; set; } = string.Empty;
        public DateTime Date { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public int CategoryId { get; set; }
        public Category? Category { get; set; }
    }
}