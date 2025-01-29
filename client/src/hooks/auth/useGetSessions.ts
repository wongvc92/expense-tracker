import { useQuery } from "@tanstack/react-query";
import apiClient from "@/utils/apiClient";
import { IUserSession } from "@/types/IUserSession";

const getSessions = async (): Promise<IUserSession[]> => {
  const url = "/api/auth/sessions";
  const res = await apiClient.get(url);
  return res.data;
};

export const useGetSessions = () => {
  return useQuery({
    queryKey: ["userSession"],
    queryFn: getSessions,
    staleTime: Infinity,
  });
};
