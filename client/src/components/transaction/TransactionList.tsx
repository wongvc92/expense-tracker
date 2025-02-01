import { useGetAllTransactions } from "@/hooks/transaction/useGetAllTransactions";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const TransactionList = () => {
  const { data } = useGetAllTransactions();
  console.log("useGetAllTransactions", data);

  return (
    <div className="flex flex-col gap-4">
      {data?.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="flex justify-between items-center p-4">
            <div>
              <h3 className="text-lg font-semibold">
                {transaction.transactionType === "expense" ? transaction.expense?.category.name : transaction.income?.source}
              </h3>
              <p className="text-sm text-muted-foreground">{format(transaction.date, "HH:mm dd/MM/yy")}</p>
            </div>
            <p className={cn("text-lg font-bold", transaction.transactionType === "expense" ? "text-red-500" : "text-green-500")}>
              {transaction.transactionType === "expense"
                ? `-RM ${transaction.expense?.amount.toFixed(2)}`
                : `+RM ${transaction.income?.amount.toFixed(2)}`}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
