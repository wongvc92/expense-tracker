import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SubmitButton from "../common/submit-button";
import { newPasswordSchema, TNewPasswordSchema } from "@/validation/authSchema";
import { useNavigate, useSearchParams } from "react-router";
import useNewPassword from "@/hooks/auth/useNewPassword";

const NewPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const { mutate, isPending } = useNewPassword();
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const form = useForm<TNewPasswordSchema>({
    resolver: zodResolver(newPasswordSchema),
    mode: "onChange",
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!token || !userId) return;
    mutate({ token, newPassword: form.getValues().newPassword, userId }, { onSuccess: () => navigate({ pathname: "/auth/login" }) });
  };

  return (
    <div className="flex flex-col space-y-4 ">
      <p className="text-center">Enter a new password</p>
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="newPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                {form.formState.errors.newPassword && <FormMessage>{form.formState.errors.newPassword.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Confirm password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>

                {form.formState.errors.confirmPassword && <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="token"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input type="hidden" {...field} />
                </FormControl>
              </FormItem>
            )}
          />

          <SubmitButton
            disabled={!form.formState.isValid}
            isLoading={isPending}
            defaultTitle="Register new password"
            isLoadingTitle="Registering..."
            hideTitle={false}
            className="w-full"
          />
        </form>
      </Form>
    </div>
  );
};

export default NewPasswordForm;
