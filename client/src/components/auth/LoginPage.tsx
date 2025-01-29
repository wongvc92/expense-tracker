import { useAuth } from "@/context/auth";
import { LoginForm } from "./login-form";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const LoginPage = () => {
  const { isAuthenticated } = useAuth();

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ pathname: "/" });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="max-w-3xl mx-auto px-4 pt-10">
      <div className="space-y-4">
        <div className="text-center font-bold">Welcome to onlyfriends</div>
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
