import { z } from "zod";

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, { message: "Enter your current password." }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(64, { message: "Password too long." }),
    confirmPassword: z.string().min(1, { message: "Confirm your new password." }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: "New password must be different from your current one.",
    path: ["newPassword"],
  });

export type ChangePasswordValues = z.infer<typeof ChangePasswordSchema>;
