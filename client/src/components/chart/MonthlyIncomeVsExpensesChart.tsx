import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import useChartData from "@/hooks/chart/useChartData";

const MonthlyIncomeVsExpensesChart = () => {
  const { monthlyChartData } = useChartData();

  console.log("Monthly Chart Data:", monthlyChartData); // Debugging

  const chartConfig = {
    Income: {
      label: "Income",
      color: "#4CAF50",
    },
    Expenses: {
      label: "Expenses",
      color: "#F44336",
    },
  } satisfies ChartConfig;

  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Monthly Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-w-full overflow-hidden">
          <BarChart accessibilityLayer data={monthlyChartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 3)} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Income" fill="var(--color-Income)" />
            <Bar dataKey="Expenses" fill="var(--color-Expenses)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default MonthlyIncomeVsExpensesChart;
