import { zodResolver } from "@hookform/resolvers/zod";
import { settingsSchema, TSettingsSchema } from "@/validation/settingsSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Switch } from "../ui/switch";
import Spinner from "../ui/spinner";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/auth";
import { useAuthSettings } from "@/hooks/auth/useAuthSettings";
import { useEffect } from "react";

const SettingsForm = () => {
  const { user } = useAuth();

  const { mutate, isPending } = useAuthSettings();

  const form = useForm<TSettingsSchema>({
    resolver: zodResolver(settingsSchema),
    mode: "onSubmit",
    defaultValues: {
      userName: "",
      email: "",
      oldPassword: "",
      newPassword: "",
      twoFactorEnabled: false,
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({ email: user.email, twoFactorEnabled: user.twoFactorEnabled, userName: user.userName });
    }
  }, [form, user]);

  const onSubmit = async (formData: TSettingsSchema) => {
    mutate(formData, {
      onSuccess: () => {
        form.resetField("oldPassword");
        form.resetField("oldPassword");
      },
    });
  };

  const isSameUsername = user && form.watch("userName") === user.userName;
  const isSameEmail = user && form.watch("email") === user.email;
  const isnewPasswordFilled = form.watch("newPassword") ? true : false;
  const isOldPasswordFilled = form.watch("oldPassword") ? true : false;
  const isTwoFactorChanged = form.watch("twoFactorEnabled") !== user?.twoFactorEnabled ? true : false;

  const disableSubmitButton = () => {
    if (!isSameEmail || isTwoFactorChanged || !isSameUsername) return false;
    if (isnewPasswordFilled && !isOldPasswordFilled) return true;
    if (isnewPasswordFilled && isOldPasswordFilled) return false;
    return true;
  };

  const isOauth = user && user.isOauth ? true : false;

  return (
    <div>
      <div className="flex items-center gap-2 py-2">
        <p className="text-muted-foreground">
          Role: <span className="rounded-md text-sm bg-muted p-1 text-black">{user?.role || ""}</span>
        </p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            name="userName"
            render={({ field }) => (
              <FormItem className="flex flex-col py-2">
                <FormLabel className="flex text-muted-foreground">Username</FormLabel>
                <FormControl>
                  <Input type="text" {...field} disabled={isPending || isOldPasswordFilled || isnewPasswordFilled || isTwoFactorChanged} />
                </FormControl>
                {form.formState.errors.userName && <FormMessage>{form.formState.errors.userName.message}</FormMessage>}
              </FormItem>
            )}
          />
          {!isOauth && (
            <div>
              <FormField
                name="email"
                render={({ field }) => (
                  <FormItem className="flex flex-col py-2">
                    <FormLabel className="flex text-muted-foreground">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={isPending || isOldPasswordFilled || isnewPasswordFilled || isTwoFactorChanged || !isSameUsername}
                      />
                    </FormControl>
                    {form.formState.errors.email && <FormMessage>{form.formState.errors.email.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                name="oldPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col py-2">
                    <FormLabel className="flex  text-muted-foreground">Old Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending || !isSameEmail || isTwoFactorChanged || !isSameUsername} />
                    </FormControl>

                    {form.formState.errors.oldPassword && <FormMessage>{form.formState.errors.oldPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
              <FormField
                name="newPassword"
                render={({ field }) => (
                  <FormItem className="flex flex-col py-2">
                    <FormLabel className="flex text-muted-foreground">New Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} disabled={isPending || !isSameEmail || isTwoFactorChanged || !isSameUsername} />
                    </FormControl>

                    {form.formState.errors.newPassword && <FormMessage>{form.formState.errors.newPassword.message}</FormMessage>}
                  </FormItem>
                )}
              />
            </div>
          )}

          <FormField
            name="twoFactorEnabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-baseline justify-between gap-2 rounded-lg border p-3 my-5 shadow-sm">
                <div className="space-y-0.5">
                  <FormLabel className="text-muted-foreground">Two Factor Authentication</FormLabel>
                  <FormDescription>Enable two factor authentication for your account</FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isPending || isOldPasswordFilled || isnewPasswordFilled || !isSameEmail || !isSameUsername}
                  />
                </FormControl>

                {form.formState.errors.twoFactorEnabled && <FormMessage>{form.formState.errors.twoFactorEnabled.message}</FormMessage>}
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full my-5" disabled={isPending || disableSubmitButton()}>
            {isPending ? (
              <span className="flex items-center gap-2">
                <Spinner /> Updating info...
              </span>
            ) : (
              "Update info"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};
export default SettingsForm;
