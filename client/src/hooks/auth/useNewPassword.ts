import { basePath } from "@/utils/basePath";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const newPassword = async ({ token, newPassword, userId }: { token: string; newPassword: string; userId: string }) => {
  const url = basePath("/api/auth/new-password");
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ token, newPassword, userId }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Error changing password");
  }
  const data = await res.json();
  return data;
};

const useNewPassword = () => {
  return useMutation({
    mutationFn: newPassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error) => {
      toast.error("Error changing password");
      console.error("Error changing password:", error.message);
    },
  });
};

export default useNewPassword;
