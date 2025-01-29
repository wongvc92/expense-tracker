import { z } from "zod";

export const registerSchema = z
  .object({
    username: z.string().min(10, { message: "Username must contain at least 10 character(s)" }).max(255),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Please enter the same password.",
    path: ["confirmPassword"],
  });

export type TRegisterSchema = z.infer<typeof registerSchema>;

export const verifyEmailByTokenSchema = z.object({
  token: z.string().min(1, { message: "Token is required." }),
});

export type TVerifyEmailByTokenSchema = z.infer<typeof verifyEmailByTokenSchema>;

export const loginUserSchema = z.object({
  email: z.string().email("Please provide a valid email."),
  password: z.string().min(1, "Password is required."),
  token: z.string().optional(),
  isRememberMe: z.boolean().optional(),
});

export type TLoginUserSchema = z.infer<typeof loginUserSchema>;

export const renewAccessTokenCookieSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required."),
});

export type TRenewAccessTokenCookieSchema = z.infer<typeof renewAccessTokenCookieSchema>;

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export type TResetPasswordSchema = z.infer<typeof resetPasswordSchema>;

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, { message: "Please provide the same password", path: ["confirmPassword"] });

export type TNewPasswordSchema = z.infer<typeof newPasswordSchema>;
