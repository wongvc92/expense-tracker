import { format } from "date-fns";
import { useGetAllTransactions } from "../transaction/useGetAllTransactions";

const useChartData = () => {
  // 1️⃣ Get cached transactions
  const { data: transactions } = useGetAllTransactions();
  console.log("transactions", transactions);

  if (!transactions || !transactions.length) return { monthlyChartData: [], categoryChartData: [], balanceChartData: [], cashFlowData: [] };

  // 2️⃣ Process Data for Monthly Income vs Expenses (Bar Chart)
  const monthlyData = transactions.reduce<Record<string, { month: string; Income: number; Expenses: number }>>((acc, t) => {
    const month = format(new Date(t.date), "MMMM"); // Format date to full month name (e.g., "January")

    if (!acc[month]) acc[month] = { month, Income: 0, Expenses: 0 };

    if (t.transactionType === "income") acc[month].Income += t.amount;
    if (t.transactionType === "expense") acc[month].Expenses += Math.abs(t.amount); // Ensure positive values

    return acc;
  }, {});

  const monthlyChartData = Object.values(monthlyData);

  // 3️⃣ Process Data for Expense Categories Breakdown (Pie Chart)
  const categoryData = transactions
    .filter((t) => t.transactionType === "expense" && t.expense?.category)
    .reduce<Record<string, { name: string; value: number }>>((acc, t) => {
      const category = t.expense?.category?.name || "Other";
      if (!acc[category]) acc[category] = { name: category, value: 0 };
      acc[category].value += Math.abs(t.amount);
      return acc;
    }, {});

  const categoryChartData = Object.values(categoryData).map((category) => ({
    ...category,
    fill: `var(--color-${category.name.toLowerCase().replace(/\s+/g, "-")})`, // Add dynamic fill color
  }));

  console.log("categoryChartData", categoryChartData);

  // 4️⃣ Process Data for Balance Over Time (Line Chart)
  let balance = 0;
  const balanceChartData = transactions
    .slice() // Prevent mutation
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((t) => {
      balance += t.transactionType === "income" ? t.amount : -t.amount;
      return { date: new Date(t.date).toLocaleDateString(), balance };
    });

  // 5️⃣ Process Data for Cash Flow (Area Chart)
  const cashFlowData = transactions.map((t) => ({
    date: new Date(t.date).toLocaleDateString(),
    income: t.transactionType === "income" ? t.amount : 0,
    expense: t.transactionType === "expense" ? Math.abs(t.amount) : 0,
  }));

  console.log("categoryChartData", categoryChartData);
  return { monthlyChartData, categoryChartData, balanceChartData, cashFlowData };
};

export default useChartData;
