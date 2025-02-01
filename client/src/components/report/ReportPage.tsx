import ExpenseBreakdownPieChart from "../chart/ExpenseBreakdownPieChart";
import MonthlyIncomeVsExpensesChart from "../chart/MonthlyIncomeVsExpensesChart";

const ReportPage = () => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 w-full">
      <div className="w-full md:w-1/2">
        <MonthlyIncomeVsExpensesChart />
      </div>
      <div className="w-full md:w-1/2">
        <ExpenseBreakdownPieChart />
      </div>
    </div>
  );
};

export default ReportPage;
