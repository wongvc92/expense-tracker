import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import apiClient from "@/utils/apiClient";
import { authKeys } from "./authKeys";
import { useLogout } from "./useLogout";

const verifyEmailChangeByToken = async ({ token, userId }: { token: string; userId: string }) => {
  const url = "/api/auth/verify-email-change";
  const res = await apiClient.post(url, { userId, token });
  return res.data;
};

export const useVerifyEmailChange = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate } = useLogout();
  return useMutation({
    mutationFn: verifyEmailChangeByToken,
    onSuccess: () => {
      toast.success("Successfully verified! Proceed to login");
      mutate();
      navigate({ pathname: "/auth/login" });
      queryClient.invalidateQueries({ queryKey: authKeys.all });
    },
    onError: (data) => {
      toast.error(data.message || "verification failed.");
      navigate({ pathname: "/auth/login" });
    },
  });
};
