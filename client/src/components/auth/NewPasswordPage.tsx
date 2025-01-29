import WidthWrapper from "../common/width-wrapper";
import NewPasswordForm from "./NewPasswordForm";

const NewPasswordPage = () => {
  return (
    <WidthWrapper>
      <div className="max-w-sm mx-auto px-4 pt-10">
        <div className="space-y-4">
          <div className="text-center font-bold">
            <p className="text-center">Forgot your password?</p>
          </div>
          <NewPasswordForm />
        </div>
      </div>
    </WidthWrapper>
  );
};

export default NewPasswordPage;
