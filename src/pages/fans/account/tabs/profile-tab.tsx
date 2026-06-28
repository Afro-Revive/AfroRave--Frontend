import { date_list } from "@/components/constants";
import { FormBase, FormField } from "@/components/reusable/base-form";
import { BaseSelect } from "@/components/reusable/base-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useUpdateUserProfile,
  useUserProfile,
} from "@/hooks/use-profile-mutations";
import {
  transformProfileFromResponse,
  transformProfileToUpdateRequest,
} from "@/lib/profile-transforms";
import { africanCountryCodes } from "@/pages/creators/add-event/constant";
import { ProfileSchema, defaultProfileValues } from "@/schema/profile-shema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
// import '../fan-account.css'

export default function ProfileTab() {
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfile();
  const updateProfileMutation = useUpdateUserProfile();
  const [showBanner, setShowBanner] = useState(false);

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: defaultProfileValues,
  });

  useEffect(() => {
    if (profileData) {
      console.log(profileData);
      const transformedData = transformProfileFromResponse(profileData.data);
      form.reset(transformedData);
    }
  }, [profileData, form]);

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    try {
      const updateRequest = transformProfileToUpdateRequest(values);
      await updateProfileMutation.mutateAsync(updateRequest);
      setShowBanner(true);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  // Sub-field inputs (birthday selects, phone code) — no inset label
  const inputStyle =
    "w-full !h-[64px] rounded-[8px] border border-white bg-transparent font-light px-4 pb-2 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";
  // Taller <Input> with room for inset label at top
  const labeledInputStyle =
    "w-full h-[64px] rounded-[8px] border border-white bg-transparent px-4 pt-6 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";
  // Taller <BaseSelect> trigger with value pushed to bottom
  const labeledSelectStyle =
    "w-full !h-[64px] rounded-[8px] border border-white bg-transparent px-4 pb-2 text-white text-sm font-sf-pro-display placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all tracking-wider";
  // Absolute label rendered inside the input container
  const insetLabelStyle =
    "absolute left-4 top-[10px] text-white text-[10px] font-sf-pro-display uppercase tracking-widest pointer-events-none z-10";

  const labelStyle =
    "text-white text-[11px] font-sf-pro-display uppercase tracking-widest  ml-1 block";

  return (
    <div className="w-full flex-1 flex flex-col items-center px-4 md:px-0 pt-8">
      <div className="w-full max-w-[550px] flex flex-col ">
        {/* Green Notification Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full bg-[#D4F4DD] rounded-[4px] px-5 py-[14px] flex items-center justify-between mb-6"
            >
              <p className="text-[#1F1F1F] text-[13px] font-ibm-plex-mono font-medium">
                User profile has been successfully completed. You can now{" "}
                <span className="underline cursor-pointer">
                  view your tickets
                </span>
              </p>
              <button
                onClick={() => setShowBanner(false)}
                className="text-[#1F1F1F] hover:text-[#1F1F1F]/70 transition-colors"
                aria-label="Close banner"
              >
                <X className="w-4 h-4" strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <h2 className="text-xl font-extrabold font-inter tracking-wide text-white mb-4">
          Profile
        </h2>

        <h2 className="text-base text-white font-inter mb-3">
          User Information
        </h2>

        <FormBase
          form={form}
          onSubmit={onSubmit}
          className="w-full flex flex-col gap-3 "
        >
          {/* First Name */}
          <FormField form={form} name="first_name" className="w-full">
            {(field) => (
              <div className="relative w-full">
                <label className={insetLabelStyle}>First Name</label>
                <Input
                  {...field}
                  placeholder=""
                  className={labeledInputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Last Name */}
          <FormField form={form} name="last_name" className="w-full">
            {(field) => (
              <div className="relative w-full">
                <label className={insetLabelStyle}>Last Name</label>
                <Input
                  {...field}
                  placeholder=""
                  className={labeledInputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Email */}
          <FormField form={form} name="email" className="w-full">
            {(field) => (
              <div className="relative w-full">
                <label className={insetLabelStyle}>Email</label>
                <Input
                  {...field}
                  type="email"
                  placeholder=""
                  className={labeledInputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Password — display only, not editable on this screen */}
          <FormField form={form} name="password" className="w-full">
            {(field) => (
              <div className="relative w-full opacity-70 cursor-not-allowed">
                <label className={`${insetLabelStyle} !text-[#ACACAC] `}>Password</label>
                <Input
                  {...field}
                  type="password"
                  placeholder="********"
                  disabled
                  tabIndex={-1}
                  className={`${labeledInputStyle} pointer-events-none bg-[#595959] text-[#ACACAC] placeholder-[#ACACAC] border-none`}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          <h2 className="text-base text-white font-inter my-2">
            Personal Details{" "}
          </h2>

          {/* Gender */}
          <FormField form={form} name="gender" className="w-full">
            {(field) => (
              <div className="relative  w-full">
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
                  triggerClassName={labeledSelectStyle}
                />
              </div>
            )}
          </FormField>

          {/* Birthday */}
          <div className="w-full">
            <div className="w-full grid grid-cols-4 gap-4">
              <div className="border border-white rounded-md flex items-center px-2">
                <label className={labelStyle}>Birthday</label>
              </div>

              {/* Month */}
              <FormField
                form={form}
                name="birthday.month"
                className="w-full"
                labelClassName="sr-only"
              >
                {(field) => (
                  <div className="relative w-full">
                    <label className={insetLabelStyle}>Month</label>
                    <BaseSelect
                      type="others"
                      placeholder="Month"
                      onChange={field.onChange}
                      value={field.value as string}
                      items={date_list.items}
                      triggerClassName={inputStyle}
                    />
                  </div>
                )}
              </FormField>

              {/* Day */}
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
                      placeholder="Day"
                      onChange={field.onChange}
                      value={field.value as string}
                      items={days}
                      triggerClassName={inputStyle}
                    />
                  </div>
                )}
              </FormField>

              {/* Year */}
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
                      placeholder="Year"
                      onChange={field.onChange}
                      value={field.value as string}
                      items={years}
                      triggerClassName={inputStyle}
                      valueClassName=""
                    />
                  </div>
                )}
              </FormField>
            </div>
          </div>

          {/* Country */}
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
                    triggerClassName={labeledSelectStyle}
                  />
                </div>
              )}
            </FormField>

            {/* State */}
            <FormField form={form} name="state" className="w-full">
              {(field) => (
                <div className="relative w-full">
                  <label className={insetLabelStyle}>State</label>
                  <Input
                    {...field}
                    placeholder=""
                    className={labeledInputStyle}
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
                  triggerClassName={`${inputStyle} !items-center`}
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
                  <label className={insetLabelStyle}>Phone Number</label>
                  <Input
                    {...field}
                    type="tel"
                    placeholder=""
                    className={labeledInputStyle}
                    value={field.value as string}
                  />
                </div>
              )}
            </FormField>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8 pb-12">
            <Button
              type="submit"
              disabled={isLoadingProfile || updateProfileMutation.isPending}
              className="w-[160px] h-[48px] font-ibm-plex-mono font-bold uppercase tracking-widest bg-white text-deep-red hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] text-[13px] transition-all border-none"
            >
              {updateProfileMutation.isPending ? "SAVING..." : "SAVE"}
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
