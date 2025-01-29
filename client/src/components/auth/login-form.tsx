import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/auth/useLogin";
import SubmitButton from "../common/submit-button";
import { loginUserSchema, TLoginUserSchema } from "@/validation/authSchema";
import { Link, useLocation, useSearchParams } from "react-router";
import { Checkbox } from "../ui/checkbox";

export const LoginForm = () => {
  const { mutate, isPending } = useLogin();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const form = useForm<TLoginUserSchema>({
    resolver: zodResolver(loginUserSchema),
    mode: "onChange",
    defaultValues: {
      email: "",
      password: "",
      token: "",
      isRememberMe: false,
    },
  });

  const onSubmit = () => {
    mutate(form.getValues());
  };

  console.log("form.getValues()", form.watch());
  const isShowTwoFactorToken = searchParams.get("showTwoFactor") === "true";

  const redirectParam = location.search;
  console.log("redirectParam", redirectParam);

  const onGoogleLogin = () => {
    window.location.href = `http://localhost:5295/api/auth/google-login?redirectParam=${redirectParam}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={onGoogleLogin}
      >
        Sign in with Google
      </Button>
      {/* <Button
        type="button"
        variant="outline"
        className="flex items-center gap-2 w-fit self-center font-light text-muted-foreground"
        onClick={async () =>
          await signIn("facebook", {
            callbackUrl: callbackUrl || DEFAULT_REDIRECT_LOGIN,
          })
        }
      >
        <FaFacebookF /> Sign in with Facebook
      </Button> */}
      {/* <div className="flex items-center justify-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-4 text-muted-foreground text-xs"> Or login with email</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div> */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {isShowTwoFactorToken && (
            <FormField
              name="token"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-muted-foreground">Two Factor Code</FormLabel>
                  <FormControl>
                    <Input type="token" {...field} placeholder="123456" disabled={isPending} />
                  </FormControl>
                </FormItem>
              )}
            />
          )}
          {!isShowTwoFactorToken && (
            <>
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
                name="isRememberMe"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-center gap-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isPending} />
                      </FormControl>
                      <FormLabel className="text-muted-foreground">Remember me</FormLabel>
                    </div>
                    <Button variant="link" size="sm" asChild className="px-0" type="button" disabled={isPending}>
                      <Link to="/auth/reset-password" className="mt-10">
                        Forgot password?
                      </Link>
                    </Button>
                    {form.formState.errors.password && <FormMessage>{form.formState.errors.password.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </>
          )}

          <SubmitButton
            hideTitle={false}
            defaultTitle={isShowTwoFactorToken ? "Confirm" : "Login"}
            isLoading={isPending}
            isLoadingTitle={isShowTwoFactorToken ? "Confirming" : "Logging in"}
            className="w-full"
          />
        </form>
      </Form>

      <p className=" flex items-center gap-1 text-xs font-light text-muted-foreground self-center">
        Do not have an account?{" "}
        <Link to="/auth/register" className="font-bold">
          Register
        </Link>
      </p>
    </div>
  );
};
