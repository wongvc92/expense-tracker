import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import SubmitButton from "../common/submit-button";
import { resetPasswordSchema, TResetPasswordSchema } from "@/validation/authSchema";
import { useResetPassword } from "@/hooks/auth/useResetPassword";

const ResetPasswordForm = () => {
  const { mutate, isPending } = useResetPassword();
  const form = useForm<TResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(form.getValues().email);
  };

  return (
    <div className="flex flex-col space-y-4">
      <Form {...form}>
        <form onSubmit={onSubmit} className="space-y-4">
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
              </FormItem>
            )}
          />

          <SubmitButton defaultTitle="Reset password" isLoadingTitle="Resetting password" isLoading={isPending} className="w-full" />
        </form>
      </Form>
    </div>
  );
};

export default ResetPasswordForm;
