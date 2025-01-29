import { Outlet } from "react-router";

const AuthLayout = () => {
  return (
    <div className="max-w-7xl mx-auto">
      AuthLayout
      <Outlet />
    </div>
  );
};

export default AuthLayout;
