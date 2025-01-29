using System.ComponentModel.DataAnnotations;

namespace api.Dtos.expense
{
    public class CreateExpenseDto
    {

        [Required(ErrorMessage = "Amount is required")]
        [Range(0.01, 1_000_000_000, ErrorMessage = "Amount must be between 0.01 and 1 billion")]

        public decimal Amount { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(250, ErrorMessage = "Description cannot exceed 250 characters")]
        public string Description { get; set; } = string.Empty;

        [Required(ErrorMessage = "Date is required")]
        [DataType(DataType.Date, ErrorMessage = "Invalid date format")]
        public DateTime Date { get; set; }

        [Required(ErrorMessage = "CategoryId is required")]
        [Range(1, int.MaxValue, ErrorMessage = "CategoryId must be a positive integer")]
        public int CategoryId { get; set; }


    }


}