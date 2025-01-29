import apiClient from "@/utils/apiClient";
import { TAddIncomeSchema } from "@/validation/incomeSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAddIncomeForm } from "./useAddIncomeFormModal";

// API function to add income
const addIncome = async (data: TAddIncomeSchema) => {
  const response = await apiClient.post("/api/income/add-income", data);
  return response.data;
};
export const useAddIncome = () => {
  const { closeModal } = useAddIncomeForm();
  return useMutation({
    mutationFn: addIncome,
    onSuccess: () => {
      toast.success("Income added successfully!");
      closeModal();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to add income.");
    },
  });
};
