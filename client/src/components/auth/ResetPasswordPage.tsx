import WidthWrapper from "../common/width-wrapper";
import ResetPasswordForm from "./ResetPasswordForm";

const ResetPasswordPage = () => {
  return (
    <WidthWrapper>
      <div className="px-4 pt-10 max-w-md mx-auto h-screen">
        <ResetPasswordForm />
      </div>
    </WidthWrapper>
  );
};

export default ResetPasswordPage;
