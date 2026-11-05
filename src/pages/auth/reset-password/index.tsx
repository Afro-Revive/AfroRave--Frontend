import { FormBase, FormField } from "@/components/reusable/base-form";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import { getRoutePath } from "@/config/get-route-path";
import { useResetPassword } from "@/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2 } from "lucide-react";
import { IoMdLock } from "react-icons/io";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ResetPasswordSchema, type ResetPasswordValues } from "./zod-schema";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  // The reset endpoint needs both, and neither is something the user should retype.
  const email = searchParams.get("email") ?? "";

  const [isDone, setIsDone] = useState(false);
  const resetPasswordMutation = useResetPassword();

  const form = useForm<ResetPasswordValues>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  // An incomplete reset link can't be honoured — send them back 
  useEffect(() => {
    if (!token || !email) {
      navigate(getRoutePath("home"), { replace: true });
    }
  }, [token, email, navigate]);

  if (!token || !email) return null;

  async function onSubmit(values: ResetPasswordValues) {
    await resetPasswordMutation.mutateAsync({
      email,
      token: token || "",
      newPassword: values.newPassword,
    });
    setIsDone(true);
  }

  const fieldBoxClass =
    "w-full flex items-center gap-2.5 bg-white border border-white/60 rounded-[8px] px-3 h-12";
  const fieldInputClass =
    "border-0 shadow-none focus-visible:ring-0 px-0 h-full text-sm text-black placeholder:text-black/30";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#848484] to-[#1E1E1E] flex flex-col items-center justify-center px-4 py-16">
        {isDone ? (
          <div className="flex flex-col items-center gap-4 text-center max-w-[350px]">
            <CheckCircle2 className="size-10 text-[#00AD2E]" />
            <h1 className="text-4xl uppercase font-extrabold font-inter tracking-wide text-white mb-1">
              Password reset
            </h1>
            <p className="text-sm text-white font-sf-pro-display">
              Your password has been updated. You can now sign in with your new
              password.
            </p>
            <Button
              onClick={() => navigate(getRoutePath("home"))}
              className="w-full h-10 mt-2  uppercase font-semibold bg-[#00AD2E] hover:bg-[#00AD2E]/90 font-inter text-sm"
            >
              Continue to Login
            </Button>
          </div>
        ) : (
          <div className="w-full max-w-[440px] flex flex-col bg-secondary-white px-4 py-6 md:px-8 md:py-10 rounded-[12px] shadow-lg">
            <h1 className="text-2xl font-extrabold uppercase font-inter tracking-wide text-black mb-1">
              Create New Password
            </h1>
            <p className="text-sm capitalize text-black/60 font-sf-pro-display mb-6">
              Your new password must be different from your previously used password.
            </p>

            <FormBase
              form={form}
              onSubmit={onSubmit}
              className="w-full flex flex-col gap-3"
            >

              <FormField form={form} name="newPassword" showMessage>
                {(field) => (
                  <div className={fieldBoxClass}>
                    <IoMdLock className="size-4 text-black/40 shrink-0" />
                    <PasswordInput
                      placeholder="New Password"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      disabled={isSubmitting}
                      className={fieldInputClass}
                    />
                  </div>
                )}
              </FormField>

              <FormField form={form} name="confirmPassword" showMessage>
                {(field) => (
                  <div className={fieldBoxClass}>
                    <IoMdLock className="size-4 text-black/40 shrink-0" />
                    <PasswordInput
                      placeholder="Confirm New Password"
                      value={field.value}
                      onChange={(value) => field.onChange(value)}
                      disabled={isSubmitting}
                      className={fieldInputClass}
                    />
                  </div>
                )}
              </FormField>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 mt-2 bg-[#00AD2E] hover:bg-[#00AD2E]/90 font-semibold font-sf-pro-text"
              >
                {isSubmitting ? "Resetting..." : "Reset Password"}
              </Button>
            </FormBase>
          </div>
        )}
     
    </div>
  );
}
