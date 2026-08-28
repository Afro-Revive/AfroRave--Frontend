import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import PasswordInput from "@/components/ui/password-input";
import { FormBase, FormField } from "@/components/reusable/base-form";
import { useChangePassword } from "@/hooks/use-profile-mutations";
import { useLogout } from "@/hooks/use-auth";
import { ChangePasswordSchema, type ChangePasswordValues } from "./zod-schema";
import { RiLogoutBoxLine } from "react-icons/ri";

const passwordFieldClass =
  "bg-transparent border-white py-5 rounded-sm text-white placeholder:text-white/40";

export default function SettingsPage() {
  const changePasswordMutation = useChangePassword();
  const logoutMutation = useLogout();

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  function onSubmit(values: ChangePasswordValues) {
    changePasswordMutation.mutate(
      {
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        confirmNewPassword: values.confirmPassword,
      },
      { onSuccess: () => form.reset() },
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col items-center px-4 md:px-0 pt-8">
      <div className="w-full max-w-[550px] flex flex-col gap-8 pb-[100px] pt-12">
        {/* Security Section */}
        <div className="flex flex-col gap-4 ">
          <h2 className="text-xl font-extrabold font-inter text-white">
            Account Settings
          </h2>
          <FormBase
            form={form}
            onSubmit={onSubmit}
            className="flex flex-col gap-4 max-w-md"
          >
            <FormField
              form={form}
              name="currentPassword"
              label="Current Password"
              labelClassName="text-white"
              showMessage
            >
              {(field) => (
                <PasswordInput
                  placeholder="Enter current password"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={changePasswordMutation.isPending}
                  className={passwordFieldClass}
                  iconClassName="text-white/60"
                />
              )}
            </FormField>

            <FormField
              form={form}
              name="newPassword"
              label="New Password"
              labelClassName="text-white"
              showMessage
            >
              {(field) => (
                <PasswordInput
                  placeholder="Enter new password"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={changePasswordMutation.isPending}
                  className={passwordFieldClass}
                  iconClassName="text-white/60"
                />
              )}
            </FormField>

            <FormField
              form={form}
              name="confirmPassword"
              label="Confirm New Password"
              labelClassName="text-white"
              showMessage
            >
              {(field) => (
                <PasswordInput
                  placeholder="Confirm new password"
                  value={field.value}
                  onChange={field.onChange}
                  disabled={changePasswordMutation.isPending}
                  className={passwordFieldClass}
                  iconClassName="text-white/60"
                />
              )}
            </FormField>

            <Button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="w-full mt-2 bg-white hover:bg-white/80 text-deep-red uppercase font-bold text-xs font-inter"
            >
              {changePasswordMutation.isPending
                ? "Updating..."
                : "Update Password"}
            </Button>
          </FormBase>
        </div>
        <Button
          variant="ghost"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
          className="w-fit font-inter text-sm uppercase"
        >
          <RiLogoutBoxLine className="text-deep-red w-10 h-10" />
          {logoutMutation.isPending ? "Logging out..." : "Log Out"}
        </Button>
      </div>
    </div>
  );
}
