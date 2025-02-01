using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models
{
    public class Transaction
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; } = string.Empty;
        public ApplicationUser? User { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Amount { get; set; }

        [Required]
        [StringLength(10)]
        public string TransactionType { get; set; } = "expense"; // "income" or "expense"

        [ForeignKey("Income")]
        public Guid? IncomeId { get; set; } // Nullable if not an income

        [ForeignKey("Expense")]
        public Guid? ExpenseId { get; set; } // Nullable if not an expense

        public Income? Income { get; set; }
        public Expense? Expense { get; set; }

        [Required]
        public DateTime Date { get; set; } = DateTime.UtcNow;

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime? UpdatedAt { get; set; }
    }
}
