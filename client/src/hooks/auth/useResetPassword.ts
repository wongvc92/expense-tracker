import { basePath } from "@/utils/basePath";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const resetPassword = async (email: string) => {
  const url = basePath("/api/auth/reset-password");
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) {
    const error = await res.json();
    console.log("resetPassword", error.message);
    throw new Error(error.message || "Failed to reset new password.");
  }
  const data = await res.json();
  return data;
};
export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => toast.success(data.message || "Please check email to get a new password."),
    onError: (error) => toast.error(error.message || "Failed to reset new password."),
  });
};
