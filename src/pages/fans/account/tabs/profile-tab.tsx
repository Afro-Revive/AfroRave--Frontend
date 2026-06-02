import { date_list } from '@/components/constants'
import { FormBase, FormField } from '@/components/reusable/base-form'
import { BaseSelect } from '@/components/reusable/base-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useUpdateUserProfile, useUserProfile } from '@/hooks/use-profile-mutations'
import { FakeDataGenerator } from '@/lib/fake-data-generator'
import {
  transformProfileFromResponse,
  transformProfileToUpdateRequest,
} from '@/lib/profile-transforms'
import { africanCountryCodes } from '@/pages/creators/add-event/constant'
import { ProfileSchema, defaultProfileValues } from '@/schema/profile-shema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
// import '../fan-account.css'

export default function ProfileTab() {
  const { data: profileData, isLoading: isLoadingProfile } = useUserProfile()
  const updateProfileMutation = useUpdateUserProfile()
  const [showBanner, setShowBanner] = useState(false)

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: defaultProfileValues,
  })

  useEffect(() => {
    if (profileData) {
      console.log(profileData)
      const transformedData = transformProfileFromResponse(profileData.data)
      form.reset(transformedData)
    }
  }, [profileData, form])

  async function onSubmit(values: z.infer<typeof ProfileSchema>) {
    try {
      const updateRequest = transformProfileToUpdateRequest(values)
      await updateProfileMutation.mutateAsync(updateRequest)
      setShowBanner(true)
    } catch (error) {
      console.error('Failed to update profile:', error)
    }
  }

  // Shared input styling - Figma specifications
  const inputStyle = 'w-full h-[52px] rounded-[8px] border border-white/10 bg-transparent px-4 text-white text-[14px] font-ibm-plex-mono placeholder:text-white/30 focus:border-white/30 focus-visible:ring-0 focus-visible:ring-offset-0 transition-all uppercase tracking-wider'
  const labelStyle = 'text-white/60 text-[11px] font-ibm-plex-mono uppercase tracking-widest mb-2 ml-1 block'

  return (
    <div className='w-full flex-1 flex flex-col items-center px-4 md:px-0 pt-8'>
      <div className='w-full max-w-[550px] flex flex-col gap-6'>

        {/* Green Notification Banner */}
        <AnimatePresence>
          {showBanner && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className='w-full bg-[#D4F4DD] rounded-[4px] px-5 py-[14px] flex items-center justify-between mb-6'
            >
              <p className='text-[#1F1F1F] text-[13px] font-ibm-plex-mono font-medium'>
                User profile has been successfully completed. You can now <span className="underline cursor-pointer">view your tickets</span>
              </p>
              <button
                onClick={() => setShowBanner(false)}
                className='text-[#1F1F1F] hover:text-[#1F1F1F]/70 transition-colors'
                aria-label='Close banner'
              >
                <X className='w-4 h-4' strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dev helper - hidden in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className='flex justify-end'>
            <FakeDataGenerator
              type='profile'
              onGenerate={form.reset}
              buttonText='🎲 Fill with sample data'
              variant='outline'
              className='h-9 px-4 border-white/30 text-white/70 hover:bg-white/5 hover:text-white text-[13px]'
            />
          </div>
        )}

        <FormBase
          form={form}
          onSubmit={onSubmit}
          className='w-full flex flex-col gap-6'>

          {/* First Name */}
          <FormField
            form={form}
            name="first_name"
            label="First Name"
            className="w-full">
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>First Name</label>
                <Input
                  {...field}
                  placeholder="First Name"
                  className={inputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Last Name */}
          <FormField
            form={form}
            name="last_name"
            label="Last Name"
            className="w-full">
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>Last Name</label>
                <Input
                  {...field}
                  placeholder="Last Name"
                  className={inputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Email */}
          <FormField
            form={form}
            name="email"
            label="Email"
            className="w-full">
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>Email</label>
                <Input
                  {...field}
                  type="email"
                  placeholder="Email"
                  className={inputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Password */}
          <FormField
            form={form}
            name="password"
            label="Password"
            className="w-full">
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>Password</label>
                <Input
                  {...field}
                  type="password"
                  placeholder="Password"
                  className={inputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Gender */}
          <FormField
            form={form}
            name='gender'
            label='Gender'
            className='w-full'>
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>Gender</label>
                <BaseSelect
                  onChange={(value) => field.onChange(value)}
                  label='Gender'
                  placeholder='Select gender'
                  value={field.value as string}
                  items={[
                    { value: 'male', label: 'Male' },
                    { value: 'female', label: 'Female' },
                    { value: 'other', label: 'Other' },
                  ]}
                  triggerClassName={inputStyle}
                />
              </div>
            )}
          </FormField>

          {/* Birthday */}
          <div className='w-full'>
            <label className={labelStyle}>Birthday</label>
            <div className='w-full grid grid-cols-3 gap-4'>
              {/* Year */}
              <FormField form={form} name="birthday.year" className='w-full' labelClassName='sr-only' label='Year'>
                {(field) => (
                  <BaseSelect
                    type='others'
                    placeholder="Year"
                    onChange={field.onChange}
                    value={field.value as string}
                    items={years}
                    triggerClassName={inputStyle}
                  />
                )}
              </FormField>

              {/* Month */}
              <FormField form={form} name="birthday.month" className='w-full' labelClassName='sr-only' label='Month'>
                {(field) => (
                  <BaseSelect
                    type='others'
                    placeholder="Month"
                    onChange={field.onChange}
                    value={field.value as string}
                    items={date_list.items}
                    triggerClassName={inputStyle}
                  />
                )}
              </FormField>

              {/* Day */}
              <FormField form={form} name="birthday.day" className='w-full' labelClassName='sr-only' label='Day'>
                {(field) => (
                  <BaseSelect
                    type='others'
                    placeholder="Day"
                    onChange={field.onChange}
                    value={field.value as string}
                    items={days}
                    triggerClassName={inputStyle}
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* Country */}
          <FormField
            form={form}
            name='country'
            label='Country'
            className='w-full'>
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>Country</label>
                <BaseSelect
                  onChange={(value) => field.onChange(value)}
                  label='Country'
                  placeholder='Select country'
                  value={field.value as string}
                  items={[
                    { value: 'nigeria', label: 'Nigeria' },
                    { value: 'ghana', label: 'Ghana' },
                    { value: 'kenya', label: 'Kenya' },
                    { value: 'south_africa', label: 'South Africa' },
                  ]}
                  triggerClassName={inputStyle}
                />
              </div>
            )}
          </FormField>

          {/* State */}
          <FormField
            form={form}
            name='state'
            label='State'
            className='w-full'>
            {(field) => (
              <div className='w-full'>
                <label className={labelStyle}>State</label>
                <Input
                  {...field}
                  placeholder="Enter state"
                  className={inputStyle}
                  value={field.value as string}
                />
              </div>
            )}
          </FormField>

          {/* Phone Number */}
          <div className='w-full'>
            <label className={labelStyle}>Phone Number</label>
            <div className='flex items-end gap-3'>
              <FormField
                form={form}
                name='number.country_code'
                label='Code'
                className='w-[140px]'
                labelClassName='sr-only'>
                {(field) => (
                  <BaseSelect
                    onChange={(value) => field.onChange(value)}
                    label='Code'
                    placeholder='+234'
                    value={field.value as string}
                    items={africanCountryCodes}
                    triggerClassName={inputStyle}
                  />
                )}
              </FormField>

              <FormField
                form={form}
                name='number.digits'
                label='Phone Number'
                labelClassName='sr-only'
                className='flex-1'>
                {(field) => (
                  <Input
                    {...field}
                    type='tel'
                    placeholder='Phone Number'
                    className={inputStyle}
                    value={field.value as string}
                  />
                )}
              </FormField>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-center mt-8 pb-12">
            <Button
              type='submit'
              disabled={isLoadingProfile || updateProfileMutation.isPending}
              className='w-[160px] h-[48px] font-ibm-plex-mono font-bold uppercase tracking-widest bg-white text-deep-red hover:bg-white/90 disabled:opacity-50 disabled:cursor-not-allowed rounded-[4px] text-[13px] transition-all border-none'>
              {updateProfileMutation.isPending ? 'SAVING...' : 'SAVE'}
            </Button>
          </div>

        </FormBase>
      </div>
    </div>
  )
}

const years = Array.from({ length: 100 }, (_, i) => {
  const year = `${new Date().getFullYear() - i}`
  return { value: year, label: year }
})

const days = Array.from({ length: 31 }, (_, i) => ({
  value: (i + 1).toString(),
  label: (i + 1).toString(),
}))