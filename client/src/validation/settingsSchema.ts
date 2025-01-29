import { z } from "zod";

export const settingsSchema = z
  .object({
    userName: z.string().min(10, { message: "Username must contain at least 10 character(s)" }).max(255),
    email: z.optional(z.string().email("Invalid email address")),
    twoFactorEnabled: z.optional(z.boolean()),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
  })
  .refine((data) => (data.newPassword && data.newPassword && !data.oldPassword ? false : true), {
    message: "Old password is required when changing password.",
    path: ["oldPassword"],
  })
  .refine((data) => (data.twoFactorEnabled && data.twoFactorEnabled === true && !data.email ? false : true), {
    message: "Email is required when enabling two-factor authentication.",
    path: ["email"],
  });

export type TSettingsSchema = z.infer<typeof settingsSchema>;
