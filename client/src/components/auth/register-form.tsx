import { Input } from "../ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";

import { useRegister } from "@/hooks/auth/useRegister";
import SubmitButton from "../common/submit-button";
import { registerSchema, TRegisterSchema } from "@/validation/authSchema";
import { Link } from "react-router";

const RegisterForm = () => {
  const { mutate, isPending } = useRegister();
  const form = useForm<TRegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="flex flex-col space-y-4 ">
      {/* <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or register with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(() => mutate(form.getValues()))} className="space-y-4">
          <FormField
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.username && <FormMessage>{form.formState.errors.username.message}</FormMessage>}
              </FormItem>
            )}
          />
          <FormField
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
              </FormItem>
            )}
          />

          <FormField
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} disabled={isPending} />
                </FormControl>
                {form.formState.errors.confirmPassword && <FormMessage>{form.formState.errors.confirmPassword.message}</FormMessage>}
              </FormItem>
            )}
          />

          <SubmitButton defaultTitle="Register" isLoading={isPending} isLoadingTitle="Registering" className="w-full" />
        </form>
      </Form>
      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Already have an account?
        <Link to="/auth/login" className="font-bold">
          Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
