import { FormSectionHeading } from '@/components/shared/form-section-heading'
import { FormBase } from '@/components/reusable'
import type { FormBaseProps } from '@/components/reusable/base-form'
import type { FieldErrors, FieldValues, UseFormReturn } from 'react-hook-form'

export function TabContainer<TFormValues extends FieldValues>({
  heading,
  description,
  headerButton,
  children,
  form,
  onSubmit,
  actionOnError,
  ...props
}: ITabContainer<TFormValues> & Omit<FormBaseProps<TFormValues>, 'form' | 'onSubmit' | 'onError'>) {
  function onError(errors: FieldErrors) {
    actionOnError?.()
    console.log('Form validation failed!')
    console.log('Validation errors:', errors)
  }

  return (
    <div className='flex flex-col items-center gap-5 mb-[50px]'>
      <div className='max-w-[560px] w-full flex flex-col md:flex-row gap-y-4 md:items-center max-md:px-5 justify-between'>
        <div className='w-full flex flex-col gap-1'>
          <FormSectionHeading as="p">{heading}</FormSectionHeading>
          {description && (
            <p className='text-xs font-inter-tight text-mid-dark-gray'>{description}</p>
          )}
        </div>

        {headerButton && headerButton}
      </div>

      <FormBase form={form} onSubmit={onSubmit} onError={onError} {...props}>
        {children}
      </FormBase>
    </div>
  )
}

interface ITabContainer<TFormValues extends FieldValues> {
  heading?: string
  description?: string
  headerButton?: React.ReactNode
  children: React.ReactNode
  form: UseFormReturn<TFormValues>
  onSubmit: (data: TFormValues) => void
  actionOnError?: () => void
}
