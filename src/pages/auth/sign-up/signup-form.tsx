import { FormBase, FormField } from '@/components/reusable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'
import { useRegisterUser } from '@/hooks/use-auth'
import type { UserSignup } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { User, Mail, Lock } from 'lucide-react'

const formSchema = z.object({
  first_name: z.string().min(2, { message: 'Name too short.' }),
  last_name: z.string().min(2, { message: 'Name too short.' }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z
    .string()
    .min(2, {
      message: 'Password too short.',
    })
    .max(20, {
      message: 'Password too long.',
    }),
  confirm_password: z.string(),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords do not match.',
  path: ['confirm_password'],
})

const fieldInputClass = 'border-0 shadow-none focus-visible:ring-0 px-0 h-full text-sm text-black placeholder:text-gray-400 bg-transparent'
const fieldBoxClass = 'w-full flex items-center gap-2.5 bg-white border border-gray-200 rounded-[8px] px-3 h-12'

interface SignupFormProps {
  onSwitchToLogin: () => void
  type: 'User' | 'Vendor' | 'Organizer'
}

export function SignupForm({ type }: SignupFormProps) {
  const registerUser = useRegisterUser()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: '',
      last_name: '',
      email: '',
      password: '',
      confirm_password: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    const userData: UserSignup = {
      firstName: values.first_name,
      lastName: values.last_name,
      email: values.email,
      password: values.password,
      accountType: type,
    }

    registerUser.mutate(userData)
  }

  return (
    <FormBase
      form={form}
      onSubmit={onSubmit}
      className='w-full h-fit rounded-[8px] space-y-0 bg-[#F5F5F5] px-7 py-6 md:px-7 md:py-8 font-sf-pro-text'>
      <p className='text-[28px] font-bold text-black font-sf-pro-text mb-6'>Sign Up</p>

      <div className='flex flex-col w-full gap-3'>
        <FormField form={form} name='first_name'>
          {(field) => (
            <div className={fieldBoxClass}>
              <User className='size-4 text-gray-400 shrink-0' />
              <Input
                placeholder='First name'
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                className={fieldInputClass}
              />
            </div>
          )}
        </FormField>

        <FormField form={form} name='last_name'>
          {(field) => (
            <div className={fieldBoxClass}>
              <User className='size-4 text-gray-400 shrink-0' />
              <Input
                placeholder='Last name'
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                className={fieldInputClass}
              />
            </div>
          )}
        </FormField>

        <FormField form={form} name='email'>
          {(field) => (
            <div className={fieldBoxClass}>
              <Mail className='size-4 text-gray-400 shrink-0' />
              <Input
                placeholder='Email Address'
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                name={field.name}
                className={fieldInputClass}
              />
            </div>
          )}
        </FormField>

        <FormField form={form} name='password' showMessage={true}>
          {(field) => (
            <div className={fieldBoxClass}>
              <Lock className='size-4 text-gray-400 shrink-0' />
              <PasswordInput
                placeholder='Password'
                value={field.value}
                onChange={(value) => field.onChange(value)}
                className={fieldInputClass}
              />
            </div>
          )}
        </FormField>

        <FormField form={form} name='confirm_password' showMessage={true}>
          {(field) => (
            <div className={fieldBoxClass}>
              <Lock className='size-4 text-gray-400 shrink-0' />
              <PasswordInput
                placeholder='Confirm Password'
                value={field.value}
                onChange={(value) => field.onChange(value)}
                className={fieldInputClass}
              />
            </div>
          )}
        </FormField>
      </div>

      <div className='pt-6'>
        <Button
          type='submit'
          className='w-full h-[50px] text-base font-semibold font-sf-pro-text bg-black hover:bg-black/90 text-white rounded-[8px]'
          disabled={registerUser.isPending}>
          {registerUser.isPending ? 'Signing Up...' : 'Sign Up'}
        </Button>
      </div>
    </FormBase>
  )
}
