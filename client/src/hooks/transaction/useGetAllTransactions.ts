import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/apiClient";
import { ITransaction } from "@/types/ITransaction";

const getAllTransactions = async (): Promise<ITransaction[]> => {
  const url = "/api/transactions/all";
  const res = await apiClient.get(url);
  return res.data;
};

export const useGetAllTransactions = () => {
  return useQuery({
    queryKey: ["transactions"],
    queryFn: getAllTransactions,
    staleTime: Infinity,
  });
};
