import { useGetAllTransactions } from "@/hooks/transaction/useGetAllTransactions";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { convertUtcToLocalTime } from "@/utils/convertUtcToLocal";
import { ITransaction } from "@/types/ITransaction";

const TransactionList = () => {
  const { data } = useGetAllTransactions();

  const getTitle = (transaction: ITransaction) =>
    transaction.transactionType === "expense" ? transaction.expense?.category.name : transaction.income?.source;

  const getDescription = (transaction: ITransaction) => (transaction.transactionType === "expense" ? transaction.expense?.description : "");

  const getDate = (transaction: ITransaction) => format(convertUtcToLocalTime(transaction.date), "HH:mm dd/MM/yy");

  const getAmount = (transaction: ITransaction) =>
    transaction.transactionType === "expense" ? `-RM ${transaction.expense?.amount.toFixed(2)}` : `+RM ${transaction.income?.amount.toFixed(2)}`;

  return (
    <div className="flex flex-col gap-4">
      {data?.data.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="flex justify-between items-center py-2">
            <div className="flex flex-col items-start space-y-1">
              <h3 className="text-lg font-semibold capitalize">{getTitle(transaction)}</h3>
              <p className="text-xs text-muted-foreground ">{getDescription(transaction)}</p>
              <p className="text-xs text-muted-foreground">{getDate(transaction)}</p>
            </div>
            <div>
              <p className={cn("text-lg font-bold", transaction.transactionType === "expense" ? "text-red-500" : "text-green-500")}>
                {getAmount(transaction)}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TransactionList;
