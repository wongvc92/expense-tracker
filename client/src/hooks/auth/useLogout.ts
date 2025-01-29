import apiClient from "@/utils/apiClient";
import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authKeys } from "./authKeys";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const logout = async () => {
  const url = basePath("/api/auth/logout");
  const res = await apiClient.post(url);
  return res.data;
};

export const useLogout = () => {
  const query = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      navigate({ pathname: "/" });
      query.invalidateQueries({ queryKey: authKeys.all });
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
