import { useEffect } from "react";
import WidthWrapper from "../common/width-wrapper";
import { useSearchParams } from "react-router";
import { useVerifyEmail } from "@/hooks/auth/useVerifyEmail";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const { mutate, isPending } = useVerifyEmail();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (userId && token) {
      mutate({ token, userId });
    }
  }, [mutate, token, userId]);

  if (isPending) {
    return <p>Verifying email...</p>;
  }
  return (
    <WidthWrapper>
      <div className="px-4 pt-10 max-w-md mx-auto h-screen">
        <h1>Email Verification</h1>
        <p>Your token is: {token}</p>
      </div>
    </WidthWrapper>
  );
};
export default VerifyEmailPage;
