import apiClient from "@/utils/apiClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";

const logoutDevice = async (sessionKey: string) => {
  const url = "/api/auth/logout-device";
  const res = await apiClient.post(url, { sessionKey });
  return res.data;
};

export const useLogoutDevice = () => {
  const quertClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationFn: logoutDevice,
    onSuccess: () => {
      toast.success("logged out device");
      navigate({ pathname: "/auth/login" });
      quertClient.invalidateQueries({ queryKey: ["userSession"] });
      quertClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error) => {
      toast.error("Error logout device");
      console.error("Error logout device: ", error.message);
    },
  });
};
