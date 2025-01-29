import { basePath } from "@/utils/basePath";
import { TRegisterSchema } from "@/validation/authSchema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

const register = async (formData: TRegisterSchema) => {
  const url = basePath("/api/auth/register");

  const body = {
    username: formData.username,
    email: formData.email,
    password: formData.password,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body }),
  });
  if (!res.ok) {
    const errRes = await res.json();
    throw new Error(errRes.title || "Failed to register user.");
  }
  const data = await res.json();
  return data;
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
    onError: (error) => {
      const errorMessage = error.message ?? "Something went wrong. Please try again.";
      toast.error(errorMessage);
    },
    onSuccess: (data) => {
      toast.success(data.message || "User registered successfully. Please check your email to confirm your account.");
      //   toast.success(data.success || "Please check email for verification!");
    },
  });
};
