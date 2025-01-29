import WidthWrapper from "../common/width-wrapper";
import RegisterForm from "./register-form";

const RegisterPage = () => {
  return (
    <WidthWrapper>
      <div className="max-w-sm mx-auto px-4 pt-10 h-screen">
        <div className="space-y-4">
          <div className="text-center font-bold">Welcome to onlyfriends</div>
          <RegisterForm />
        </div>
      </div>
    </WidthWrapper>
  );
};

export default RegisterPage;
