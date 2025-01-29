import apiClient from "@/utils/apiClient";
import { TSettingsSchema } from "@/validation/settingsSchema";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

const authSettings = async (formData: TSettingsSchema) => {
  const url = "/api/auth/settings";
  try {
    const res = await apiClient.post(url, formData);
    return res.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // Log or handle the error here if needed
      console.error("Axios error:", error.response?.data?.message || error.message);
      // Re-throw the error to be caught by react-query
      throw new Error(error.response?.data?.message || "An unexpected error occurred");
    } else {
      // Handle non-Axios errors
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export const useAuthSettings = () => {
  return useMutation({
    mutationFn: authSettings,
    onError: (error) => {
      // Handle non-Axios errors
      toast.error(error.message);
    },
    onSuccess: (data) => {
      toast.success(data.message || "Settings saved");
    },
  });
};
