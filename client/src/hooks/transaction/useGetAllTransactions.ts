import { keepPreviousData, useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/apiClient";
import { IPaginatedResponse, ITransaction } from "@/types/ITransaction";
import { useLocation, useSearchParams } from "react-router";
import { subWeeks } from "date-fns";

const getAllTransactions = async (
  page: string,
  limit: string,
  dateFrom: string,
  dateTo: string,
  categoryIds: string[],
  sortBy: string,
  sortOrder: string
): Promise<IPaginatedResponse<ITransaction>> => {
  const url = `/api/transactions/all?page=${page}&limit=${limit}&dateFrom=${dateFrom}&dateTo=${dateTo}&categoryIds=${categoryIds}&sortBy=${sortBy}&sortOrder=${sortOrder}`;
  const res = await apiClient.get(url);
  return res.data;
};

export const useGetAllTransactions = () => {
  const [searchParams] = useSearchParams();

  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "5";
  const rawDateFrom = searchParams.get("dateFrom") ?? subWeeks(new Date(), 2).toISOString();
  const rawDateTo = searchParams.get("dateTo") ?? new Date().toISOString();

  const sortBy = searchParams.get("sortBy") || "date"; // Default: sort by date
  const sortOrder = searchParams.get("sortOrder") || "desc"; // Default: descending

  const categoryIds = searchParams.getAll("category");
  const { pathname } = useLocation();
  return useQuery({
    queryKey:
      pathname === "/transactions"
        ? ["transactions", page, limit, rawDateFrom, rawDateTo, categoryIds, sortBy, sortOrder]
        : ["transactions", page, limit], // ✅ Prevents refetching loops
    queryFn: () => getAllTransactions(page, limit, rawDateFrom, rawDateTo, categoryIds, sortBy, sortOrder),
    staleTime: Infinity,
    placeholderData: keepPreviousData,
  });
};
