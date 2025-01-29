import { useEffect } from "react";
import WidthWrapper from "../common/width-wrapper";
import { useSearchParams } from "react-router";
import { useVerifyEmailChange } from "@/hooks/auth/useVerifyEmailChange";
import { toast } from "sonner";

const VerifyEmailChangePage = () => {
  const [searchParams] = useSearchParams();
  const { mutate, isPending } = useVerifyEmailChange();

  const userId = searchParams.get("userId");
  const token = searchParams.get("token");

  useEffect(() => {
    if (userId && token) {
      mutate({ token, userId }, { onSuccess: () => toast.success("Successfully verified! Proceed to login") });
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
export default VerifyEmailChangePage;
