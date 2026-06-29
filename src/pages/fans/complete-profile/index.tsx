import { FormBase, FormField } from "@/components/reusable/base-form";
import { BaseSelect } from "@/components/reusable/base-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getRoutePath } from "@/config/get-route-path";
import { useCompleteProfile } from "@/hooks";
import { useAuth } from "@/hooks/use-auth-store";
import { africanCountryCodes } from "@/pages/creators/add-event/constant";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { PersonalDetailsSchema, PersonalDetailsValues } from "./zod-schema";
import { VENDOR_CATEGORIES } from "@/types/vendor";

export default function CompleteProfilePage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");
  const { user } = useAuth();
  const userAccountType = user?.accountType;

  const completeProfileMutation = useCompleteProfile();

  const form = useForm<PersonalDetailsValues>({
    resolver: zodResolver(PersonalDetailsSchema),
    defaultValues: {
      gender: "",
      companyName: "",
      companyWebsite: "",
      birthday: { month: "", day: "", year: "" },
      country: "",
      state: "",
      number: { country_code: "+234", digits: "" },
      category: "",
    },
  });

  const { formState: { errors, isSubmitting }, watch, setValue } = form
  const category = watch('category')

  useEffect(() => {
    if (!token) {
      navigate(getRoutePath("home"), { replace: true });
    }
  }, [token, navigate]);

  useEffect(() => {
    if (user === null) {
      toast.error("Session expired. Please log in to continue.");
      navigate(getRoutePath("home"), { replace: true });
    }
  }, [user, navigate]);

  if (!token) return null;

  async function onSubmit(values: PersonalDetailsValues) {
    if (!user) return;
    const dateOfBirth = `${values.birthday.year}-${values.birthday.month.padStart(2, "0")}-${values.birthday.day.padStart(2, "0")}`;
    await completeProfileMutation.mutateAsync({
      token: token || "",
      telephone: `${values.number.country_code}${values.number.digits}`,
      companyName: values.companyName,
      website: values.companyWebsite,
      gender: values.gender,
      dateOfBirth,
      country: values.country,
      state: values.state,
    });
  }

  const labeledInputStyle =
    "w-full h-[64px] rounded-[8px] border border-white/40 bg-transparent px-4 pt-6 text-white text-sm font-sf-pro-display font-light placeholder:text-white/20 focus-visible:ring-0 focus-visible:ring-offset-0 tracking-wider cursor-default";

  const editableInputStyle =
    "w-full h-[64px] rounded-[8px] border border-white bg-transparent px-4 pt-6 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";

  const editableSelectStyle =
    "w-full !h-[64px] rounded-[8px] border border-white bg-transparent px-4 pb-2 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";

  const editableInputStyleNoLabel =
    "w-full !h-[64px] rounded-[8px] border border-white bg-transparent px-4 pb-2 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";

  const insetLabelStyle =
    "absolute left-4 top-[10px] text-white text-[10px] font-sf-pro-display uppercase tracking-widest pointer-events-none z-10";

  const dimInsetLabelStyle =
    "absolute left-4 top-[10px] text-white/60 text-[10px] font-sf-pro-display uppercase tracking-widest pointer-events-none z-10";

  const labelStyle =
    "text-white/60 text-[11px] font-sf-pro-display uppercase tracking-widest ml-1 block";

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#848484] to-[#1E1E1E] flex flex-col items-center px-4 pt-16 pb-16">
      <div className="w-full max-w-[550px] flex flex-col">
        <h2 className="text-xl font-extrabold font-inter tracking-wide text-white mb-4">
          Complete Your Profile
        </h2>

        <h2 className="text-base text-white font-inter mb-3">
          User Information
        </h2>

        {/* Read-only User Information */}
        <div className="w-full flex flex-col gap-3 mb-6">
          <div className="w-full flex flex-row gap-4">
            <div className="relative w-full">
              <label className={dimInsetLabelStyle}>First Name</label>
              <Input
                readOnly
                tabIndex={-1}
                placeholder=""
                className={`${labeledInputStyle} bg-[#949494] text-white/70 border-none`}
                value={user?.profile.firstName ?? ""}
              />
            </div>

            <div className="relative w-full">
              <label className={dimInsetLabelStyle}>Last Name</label>
              <Input
                readOnly
                tabIndex={-1}
                placeholder=""
                className={`${labeledInputStyle} bg-[#949494] text-white/70 border-none`}
                value={user?.profile.lastName ?? ""}
              />
            </div>
          </div>

          <div className="relative w-full">
            <label className={dimInsetLabelStyle}>Email</label>
            <Input
              readOnly
              tabIndex={-1}
              type="email"
              placeholder=""
              className={`${labeledInputStyle} bg-[#949494] text-white/70 border-none`}
              value={user?.email ?? ""}
            />
          </div>

          <div className="relative w-full">
            <label className={dimInsetLabelStyle}>Password</label>
            <Input
              readOnly
              tabIndex={-1}
              type="text"
              className={`${labeledInputStyle} bg-[#949494] text-white/70 border-none`}
              value="••••••••"
            />
          </div>
        </div>

        <FormBase
          form={form}
          onSubmit={(onSubmit)}
          className="w-full flex flex-col gap-3"
        >
          {userAccountType === "Vendor" && (
            <div className="w-full flex-row gap-4">
              <div>
                <Select
                  value={category}
                  onValueChange={(value) => setValue("category", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className="w-full bg-[#1C1C1E] text-white border-0 h-11">
                    <SelectValue placeholder="CATEGORY" />
                  </SelectTrigger>
                  <SelectContent className="z-[1000001]">
                    {VENDOR_CATEGORIES.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-xs text-red-400 mt-1">
                    {errors.category.message}
                  </p>
                )}
              </div>
            </div>
          )}

          {(userAccountType === "Organizer" || userAccountType === "Vendor") && (
              <div className="w-full flex flex-col gap-3 mb-3">
                <h2 className="text-base text-white font-inter mb-3">
                  Business Details
                </h2>
                <FormField
                  form={form}
                  name="companyName"
                  labelClassName="sr-only"
                  className="flex-1"
                  showMessage
                >
                  {(field) => (
                    <div className="relative w-full">
                      <label
                        className={`${insetLabelStyle} placeholder:text-white `}
                      >
                        COMPANY NAME
                      </label>
                      <Input
                        {...field}
                        type="text"
                        placeholder=""
                        className={editableInputStyle}
                        value={field.value as string}
                      />
                    </div>
                  )}
                </FormField>
                <FormField
                  form={form}
                  name="companyWebsite"
                  labelClassName="sr-only"
                  className="flex-1"
                  showMessage
                >
                  {(field) => (
                    <div className="relative w-full">
                      <label
                        className={`${insetLabelStyle} placeholder:text-white `}
                      >
                        WEB URL (OPTIONAL)
                      </label>
                      <Input
                        {...field}
                        type="text"
                        placeholder=""
                        className={editableInputStyle}
                        value={field.value as string}
                      />
                    </div>
                  )}
                </FormField>
              </div>
          )}

          {/* Editable Personal Details */}
          <h2 className="text-base text-white font-inter mb-3">
            Personal Details
          </h2>
          {/* Gender */}
          <FormField form={form} name="gender" className="w-full" showMessage>
            {(field) => (
              <div className="relative w-full">
                <label className={insetLabelStyle}>Gender</label>
                <BaseSelect
                  onChange={(value) => field.onChange(value)}
                  placeholder=""
                  value={field.value as string}
                  items={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                    { value: "other", label: "Other" },
                  ]}
                  triggerClassName={editableSelectStyle}
                />
              </div>
            )}
          </FormField>

          {/* Birthday */}
          <div className="w-full">
            <div className="w-full grid grid-cols-4 gap-4">
              <div className="border border-white/40 rounded-md flex items-center px-2">
                <label className={labelStyle}>Birthday</label>
              </div>

              <FormField
                form={form}
                name="birthday.month"
                className="w-full"
                labelClassName="sr-only"
                showMessage
              >
                {(field) => (
                  <div className="relative w-full">
                    <label className={insetLabelStyle}>Month</label>
                    <BaseSelect
                      type="others"
                      placeholder=""
                      onChange={field.onChange}
                      value={field.value as string}
                      items={months}
                      triggerClassName={editableInputStyleNoLabel}
                    />
                  </div>
                )}
              </FormField>

              <FormField
                form={form}
                name="birthday.day"
                className="w-full"
                labelClassName="sr-only"
              >
                {(field) => (
                  <div className="relative w-full">
                    <label className={insetLabelStyle}>Day</label>
                    <BaseSelect
                      type="others"
                      placeholder=""
                      onChange={field.onChange}
                      value={field.value as string}
                      items={days}
                      triggerClassName={editableInputStyleNoLabel}
                    />
                  </div>
                )}
              </FormField>

              <FormField
                form={form}
                name="birthday.year"
                className="w-full"
                labelClassName="sr-only"
              >
                {(field) => (
                  <div className="relative w-full">
                    <label className={insetLabelStyle}>Year</label>
                    <BaseSelect
                      type="others"
                      placeholder=""
                      onChange={field.onChange}
                      value={field.value as string}
                      items={years}
                      triggerClassName={editableInputStyleNoLabel}
                    />
                  </div>
                )}
              </FormField>
            </div>
          </div>

          {/* Country + State */}
          <div className="w-full flex flex-row gap-4">
            <FormField form={form} name="country" className="w-full">
              {(field) => (
                <div className="relative w-full">
                  <label className={insetLabelStyle}>Country</label>
                  <BaseSelect
                    onChange={(value) => field.onChange(value)}
                    placeholder=""
                    value={field.value as string}
                    items={[
                      { value: "nigeria", label: "Nigeria" },
                      { value: "ghana", label: "Ghana" },
                      { value: "kenya", label: "Kenya" },
                      { value: "south_africa", label: "South Africa" },
                    ]}
                    triggerClassName={editableSelectStyle}
                  />
                </div>
              )}
            </FormField>

            <FormField form={form} name="state" className="w-full">
              {(field) => (
                <div className="relative w-full">
                  <label className={insetLabelStyle}>State</label>
                  <Input
                    {...field}
                    placeholder=""
                    className={editableInputStyle}
                    value={field.value as string}
                  />
                </div>
              )}
            </FormField>
          </div>

          {/* Phone Number */}
          <div className="flex gap-3">
            <FormField
              form={form}
              name="number.country_code"
              className="w-[120px] shrink-0"
              labelClassName="sr-only"
            >
              {(field) => (
                <BaseSelect
                  onChange={(value) => field.onChange(value)}
                  placeholder="+234"
                  value={field.value as string}
                  items={africanCountryCodes}
                  triggerClassName={`${editableInputStyleNoLabel} !items-center`}
                />
              )}
            </FormField>

            <FormField
              form={form}
              name="number.digits"
              labelClassName="sr-only"
              className="flex-1"
            >
              {(field) => (
                <div className="relative w-full">
                  <label
                    className={`${insetLabelStyle} placeholder:text-white `}
                  >
                    Phone Number
                  </label>
                  <Input
                    {...field}
                    type="tel"
                    placeholder=""
                    className={editableInputStyle}
                    value={field.value as string}
                  />
                </div>
              )}
            </FormField>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8 pb-4">
            <Button
              type="submit"
              disabled={completeProfileMutation.isPending}
              className="w-full h-[48px] font-sf-pro-display font-bold uppercase tracking-widest bg-white text-[#AE0D0D] hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] text-[13px] transition-all border-none"
            >
              {completeProfileMutation.isPending ? "SAVING..." : "SAVE"}
            </Button>
          </div>
        </FormBase>
      </div>
    </div>
  );
}

const years = Array.from({ length: 100 }, (_, i) => {
  const year = `${new Date().getFullYear() - i}`;
  return { value: year, label: year };
});

const days = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}));

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];
