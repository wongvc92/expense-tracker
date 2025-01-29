import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { authKeys } from "./authKeys";

const verifyEmailByToken = async ({ token, userId }: { token: string; userId: string }) => {
  const url = basePath("/api/auth/verify-email");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userId, token }),
  });
  if (!res.ok) {
    const errorData = await res.json();
    return errorData;
  }
  return await res.json();
};

export const useVerifyEmail = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: verifyEmailByToken,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: authKeys.all });
      toast.success(data.message || "Successfully verified! Proceed to login");
      navigate({ pathname: "/auth/login" });
    },
    onError: (data) => {
      toast.error(data.message || "verification failed.");
    },
  });
};
