import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useChartData from "@/hooks/chart/useChartData";
import { PieChart, Pie } from "recharts";
import { ChartConfig, ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "../ui/chart";

const ExpenseBreakdownPieChart = () => {
  const { categoryChartData } = useChartData();

  console.log("categoryChartData", categoryChartData);

  const chartConfig = {
    visitors: {
      label: "Categories",
    },
    transportation: {
      label: "transportation",
      color: "hsl(var(--chart-1))",
    },
    Chrome: {
      label: "Chrome",
      color: "hsl(var(--chart-2))",
    },
    Safari: {
      label: "Safari",
      color: "hsl(var(--chart-3))",
    },
    Firefox: {
      label: "Firefox",
      color: "hsl(var(--chart-4))",
    },
    other: {
      label: "Other",
      color: "hsl(var(--chart-5))",
    },
  } satisfies ChartConfig;
  return (
    <Card className="w-full max-w-full overflow-hidden">
      <CardHeader>
        <CardTitle>Expense Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full max-w-full overflow-hidden">
          <PieChart>
            <Pie data={categoryChartData} dataKey="value" />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ChartLegend
              content={<ChartLegendContent nameKey="name" />}
              className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseBreakdownPieChart;
