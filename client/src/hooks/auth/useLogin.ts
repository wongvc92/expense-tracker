import { basePath } from "@/utils/basePath";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { TLoginUserSchema } from "@/validation/authSchema";
import { useLocation, useNavigate } from "react-router";
import { authKeys } from "./authKeys";

const login = async (formData: TLoginUserSchema) => {
  const url = basePath("/api/auth/login");
  const res = await fetch(url, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to log in");
  }
  const data = await res.json();
  return data;
};

export const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const redirectPath = location.state?.from?.pathname || "/";
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: TLoginUserSchema) => login(formData),
    onError: (error) => {
      const errorMessage = error instanceof Error ? error.message : "Something went wrong";
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      if (data.twoFactor === true) {
        toast.success("Please check email for two factor code");
        navigate({ pathname: "/auth/login", search: "?showTwoFactor=true" });
      }
      if (data.isAuthenticated === true) {
        if (redirectPath === "/auth/login") {
          navigate({ pathname: "/" });
        }
        navigate({ pathname: redirectPath }, { replace: true });
        queryClient.invalidateQueries({ queryKey: authKeys.all });
      }
    },
  });
};
