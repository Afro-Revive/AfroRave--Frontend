import { z } from "zod";

/**
 * Only the passwords are user input — the email and token come from the reset link.
 */
export const ResetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(64, { message: "Password too long." }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordValues = z.infer<typeof ResetPasswordSchema>;
