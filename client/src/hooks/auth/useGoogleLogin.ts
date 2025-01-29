import { basePath } from "@/utils/basePath";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const googleLogin = async () => {
  const url = basePath("/api/auth/google-login");
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to log in");
  }
  const data = await res.json();
  return data;
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: googleLogin,
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    },
  });
};
