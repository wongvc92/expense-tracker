import apiClient from "@/utils/apiClient";
import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { expenseKeys } from "./commentKeys";
import { TExpenseSchema } from "@/validation/expenseSchema";

const createExpense = async (values: TExpenseSchema) => {
  const url = basePath("/api/expenses/create-expense");
  const res = await apiClient.post(url, values);
  return res.data;
};

export const useCreateExpense = () => {
  const query = useQueryClient();

  return useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      toast.success("Expense added successfully");
      query.invalidateQueries({ queryKey: expenseKeys.all });
    },
    onError: (error: unknown) => {
      if (error instanceof Error) {
        console.error("Logout error:", error.message);
        toast.error(error.message || "Failed to logout");
      } else {
        toast.error("Failed to logout");
      }
    },
  });
};
