import { useAuth } from "@/context/auth";
import { Navigate, useLocation } from "react-router";

const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Public routes to exclude from protection
  const publicPaths = ["/auth/login", "/auth/register", "/auth/reset-password", "/auth/new-password"];
  const isPublicRoute = publicPaths.includes(location.pathname);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && !isPublicRoute) {
    return <Navigate to="/auth/login" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
};
export default RequireAuth;
