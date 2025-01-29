namespace api.Dtos.income
{
    public class AddIncomeDto
    {
        public decimal Amount { get; set; }
        public string Source { get; set; } = "Other"; // Salary, Bonus, etc.
    }
}