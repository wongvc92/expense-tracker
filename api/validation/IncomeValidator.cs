

namespace api.validation
{
    public class IncomeValidator
    {
        public static string? ValidateAmount(decimal amount)
        {
            if (amount <= 0) return "Amount must be greater than 0";
            return null;
        }
    }
}