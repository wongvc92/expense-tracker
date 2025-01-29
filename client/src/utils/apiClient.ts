import axios from "axios";
import { basePath } from "./basePath";

const options = {
  baseURL: basePath(),
  withCredentials: true,
  timeout: 10000,
};

const apiClient = axios.create(options);

export const APIRefresh = axios.create({
  baseURL: basePath(),
  withCredentials: true,
  timeout: 10000,
});
APIRefresh.interceptors.response.use((response) => response);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthenticated
      if (
        window.location.pathname !== "/" &&
        window.location.pathname !== "/auth/new-password" &&
        window.location.pathname !== "/auth/verify-email" &&
        window.location.pathname !== "/auth/verify-email-change" &&
        window.location.pathname !== "/auth/login?showTwoFactor=true"
      ) {
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
