

namespace api.Dtos.income
{
    public class IncomeResponseDto
    {
        public Guid Id { get; set; }
        public decimal Amount { get; set; }
        public string Source { get; set; } = string.Empty;
        public DateTime Date { get; set; }
    }
}