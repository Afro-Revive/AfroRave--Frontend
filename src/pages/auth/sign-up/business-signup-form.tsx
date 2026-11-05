import { FormBase, FormField } from '@/components/reusable'
import { CreatorLogo } from '@/pages/auth/user-login/user-login-form'
import { BaseSelect } from '@/components/reusable'
// import type { ICustomSelectProps } from '@/components/reusable/base-select'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRegisterOrganizer, useRegisterVendor } from '@/hooks/use-auth'
import {
  africanCountryCodes,
  serviceVendorCategoryOptions,
  revenueVendorCategoryOptions,
  genderOptions,
  vendorTypes,
} from '@/pages/creators/add-event/constant'
import type { OrganizerRegisterData, VendorRegisterData } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { OnlyShowIf } from '@/lib/environment'
import { type HTMLInputTypeAttribute } from 'react'
import { type FieldValues, type Path, type UseFormReturn, useForm, useWatch } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
  first_name: z.string().min(2, { message: 'Name too short.' }),
  last_name: z.string().min(2, { message: 'Name too short.' }),
  country: z.string({
    required_error: 'Please select a country.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(6, {
      message: 'Password must be at least 6 characters.',
    })
    .max(50, {
      message: 'Password too long.',
    }),
  confirm_password: z.string(),
  phone_number: z.string().min(1, { message: 'Phone number is required.' }),
  country_code: z.string().min(1, { message: 'Country code is required.' }),
  business_name: z.string().min(2, { message: 'Business name too short.' }),
  web_url: z.string().optional(),
  portfolio_url: z.string().optional(),
  social_links: z.string().optional(),
  gender: z.string().min(1, { message: 'Please select a gender.' }),
  vendor_type: z.string().optional(),
  category: z.string().optional(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match.',
  path: ['confirm_password'],
})

interface BusinessSignUpProps {
  onSwitchToLogin: () => void
  type?: 'vendor' | 'creator'
}

export function BusinessSignUp({ onSwitchToLogin, type = 'vendor' }: BusinessSignUpProps) {
  const registerVendor = useRegisterVendor()
  const registerOrganizer = useRegisterOrganizer()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      country: '',
      email: '',
      password: '',
      confirm_password: '',
      phone_number: '',
      country_code: '+234',
      business_name: '',
      web_url: '',
      portfolio_url: '',
      social_links: '',
      gender: '',
      vendor_type: '',
      category: '',
    },
  })

  const vendorType = useWatch({ control: form.control, name: 'vendor_type' })
  const category = useWatch({ control: form.control, name: 'category' })
  const categoryOptions =
    vendorType === 'revenue_vendor' ? revenueVendorCategoryOptions : serviceVendorCategoryOptions
  const selectedCategory = categoryOptions.find((option) => option.value === category)

  function onSubmit(values: z.infer<typeof formSchema>) {
    const phoneNumber = `${values.country_code}${values.phone_number}`

    if (type === 'vendor') {
      // Transform form data to match Vendor API structure
      const vendorData: VendorRegisterData = {
        firstName: values.first_name,
        lastName: values.last_name,
        email: values.email,
        telphone: phoneNumber,
        gender: values.gender,
        businessName: values.business_name,
        vendorType: values.vendor_type || 'service_vendor',
        category: values.category || 'dj_mc',
        website: values.web_url || '',
        portfolio: values.portfolio_url || '',
        socialLinks: values.social_links || '',
        password: values.password,
      }

      registerVendor.mutate(vendorData)
    } else {
      // Transform form data to match Organizer API structure
      const organizerData: OrganizerRegisterData = {
        firstName: values.first_name,
        lastName: values.last_name,
        email: values.email,
        telphone: phoneNumber,
        gender: values.gender,
        companyName: values.business_name,
        website: values.web_url || '',
        password: values.password,
      }

      registerOrganizer.mutate(organizerData)
    }
  }

  const isPending = type === 'vendor' ? registerVendor.isPending : registerOrganizer.isPending

  // Dynamic Title & Description
  const title = type === 'vendor' ? 'OWN THE SPOTLIGHT' : 'BEYOND TICKETING'
  let description = 'TELL US ABOUT YOU'

  if (type === 'vendor') {
    description = 'TELL US ABOUT YOU'
  }

  return (
    <div className='relative flex justify-center w-full max-h-[82vh] md:max-h-[92vh] overflow-y-auto px-4'>
      <FormBase
        form={form}
        onSubmit={onSubmit}
        className='max-w-[900px] w-full rounded-[12px] space-y-3 bg-red px-6 py-6 md:px-12 md:py-8 z-10 font-sf-pro-text'>
        {type === 'vendor' && (
          <div className='flex justify-center mb-4'>
            <CreatorLogo />
          </div>
        )}

        <div className='flex flex-col gap-0.5 font-sf-pro-display text-center md:text-left mb-2'>
          <p className='uppercase text-2xl md:text-3xl font-black text-white'>{title}</p>
          <p className='uppercase text-sm font-normal text-white tracking-wider'>{description}</p>
        </div>

        <div className='flex flex-col gap-3'>
          {/* Vendor Specific: Type & Category */}
          <OnlyShowIf condition={type === 'vendor'}>
            <div className='grid md:grid-cols-2 gap-3'>
              <SelectField
                form={form}
                name='vendor_type'
                items={vendorTypes}
                className='w-full h-11 bg-[#1C1C1E] border-none [&_svg]:text-white [&_svg]:opacity-100'
                placeholder='VENDOR TYPE'
              />
              <SelectField
                form={form}
                name='category'
                items={categoryOptions}
                className='w-full h-11 bg-[#1C1C1E] border-none [&_svg]:text-white [&_svg]:opacity-100'
                placeholder='CATEGORY'
              />
            </div>
            {selectedCategory && (
              <p className='text-[11px] normal-case leading-[130%] text-white/60 font-sf-pro-display -mt-2'>
                {selectedCategory.description}
              </p>
            )}
          </OnlyShowIf>

          {/* Name Fields */}
          <div className='grid md:grid-cols-2 gap-3'>
            <InputField form={form} name='first_name' placeholder='FIRST NAME' className='h-11' />
            <InputField form={form} name='last_name' placeholder='LAST NAME' className='h-11' />
          </div>

          {/* Contact Info */}
          <div className='flex gap-2'>
            <SelectField
              form={form}
              name='country_code'
              items={africanCountryCodes}
              className='w-24 shrink-0 h-11'
              width={96}
              placeholder='CODE'
            />
            <InputField form={form} name='phone_number' placeholder='PHONE NUMBER' className='h-11' />
          </div>

          {/* Gender */}
          <SelectField
            form={form}
            name='gender'
            items={genderOptions}
            className='w-full h-11'
            placeholder='GENDER'
          />

          {/* Business Details */}
          <InputField
            form={form}
            name='business_name'
            placeholder={type === 'vendor' ? 'BUSINESS NAME' : 'COMPANY NAME'}
            className='h-11'
          />

          <InputField form={form} name='web_url' placeholder='WEBSITE URL (OPTIONAL)' className='h-11' />

          {/* Vendor Specific: Additional URLs (Side-by-side to save space) */}
          {type === 'vendor' && (
            <div className='grid md:grid-cols-2 gap-3'>
              <InputField form={form} name='portfolio_url' placeholder='PORTFOLIO URL (OPTIONAL)' className='h-11' />
              <InputField form={form} name='social_links' placeholder='SOCIAL LINKS (OPTIONAL)' className='h-11' />
            </div>
          )}

          {/* Email & Password */}
          <InputField form={form} name='email' placeholder='EMAIL ADDRESS' className='h-11' />

          <div className='grid md:grid-cols-2 gap-3'>
            <InputField form={form} name='password' placeholder='PASSWORD' type='password' className='h-11' />
            <InputField form={form} name='confirm_password' placeholder='CONFIRM PASSWORD' type='password' className='h-11' />
          </div>
        </div>

        {/* Actions */}
        <div className='w-full flex justify-center pt-2'>
          <Button
            type='submit'
            className='max-w-[200px] w-full h-10 bg-white text-sm font-bold font-sf-pro-text text-black hover:bg-white/90 uppercase tracking-wide'
            disabled={isPending}>
            {isPending ? 'Signing Up...' : 'Continue'}
          </Button>
        </div>

        <div className='flex items-center justify-center gap-1 text-sm text-white font-sf-pro-text'>
          Already have an account?{' '}
          <button
            type='button'
            onClick={onSwitchToLogin}
            className='text-base font-bold text-accent hover:underline'>
            Log In
          </button>
        </div>
      </FormBase>
    </div>
  )
}

import { cn } from '@/lib/utils'

interface InputField<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  type?: HTMLInputTypeAttribute
  placeholder: string
  className?: string
}

function InputField<T extends FieldValues>({
  form,
  name,
  type = 'text',
  placeholder,
  className,
}: InputField<T>) {
  return (
    <FormField form={form} name={name} className='w-full' showMessage>
      <Input
        type={type}
        className={cn('w-full text-white h-14 rounded-[6px] border border-white py-6 px-3 font-sf-pro-text text-[10px] font-light', className)}
        placeholder={placeholder}
      />
    </FormField>
  )
}

interface ISelectField<T extends FieldValues> {
  form: UseFormReturn<T>
  name: Path<T>
  items: { value: string; label: string }[]
  width?: number
  className?: string
  placeholder: string
}

function SelectField<T extends FieldValues>({
  form,
  name,
  width,
  className,
  items,
  placeholder,
}: ISelectField<T>) {
  return (
    <FormField form={form} name={name} className='w-full' showMessage>
      {(field) => (
        <BaseSelect
          type='others'
          placeholder={placeholder}
          width={width}
          value={field.value}
          onChange={(value) => field.onChange(value)}
          items={items}
          selectedItemRenderer={(value) => value}
          triggerClassName={cn('!w-full !h-14 py-6 px-3 border border-white rounded-[6px] !text-white placeholder:text-white [&_svg]:!text-white [&_svg]:!opacity-100', className)}
        />
      )}
    </FormField>
  )
}
