import {
  Form,
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
  FormField as ShadcnFormField,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
/**
 * A collection of form components built on top of react-hook-form and shadcn/ui Form.
 * Provides a consistent way to handle form validation, error states, and form layout.
 *
 * @example
 * ```tsx
 * const form = useForm<FormValues>()
 *
 * return (
 *   <FormBase form={form} onSubmit={handleSubmit}>
 *     <FormField
 *       form={form}
 *       name="email"
 *       label="Email"
 *       description="Enter your email address"
 *       showMessage
 *     >
 *       <Input type="email" />
 *     </FormField>
 *
 *     <FormFooter>
 *       <Button type="submit">Submit</Button>
 *     </FormFooter>
 *   </FormBase>
 * )
 * ```
 */
import React, { type ReactElement, type ReactNode } from 'react'
import type {
  ControllerRenderProps,
  FieldErrors,
  FieldValues,
  Path,
  UseFormReturn,
} from 'react-hook-form'

export interface FormBaseProps<T extends FieldValues> {
  /** React Hook Form instance */
  form: UseFormReturn<T>
  /** Form submission handler */
  onSubmit: (data: T) => void
  /** Form content */
  /** Form error handler */
  onError?: (errors: FieldErrors<T>) => void
  children: ReactNode
  /** Additional CSS classes for the form */
  className?: string
}

/**
 * Base form component that wraps react-hook-form and shadcn/ui Form.
 * Handles form submission and provides form context to child components.
 */
export function FormBase<T extends FieldValues>({
  form,
  onSubmit,
  onError,
  children,
  className,
}: FormBaseProps<T>) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className={cn('', className)}>
        {children}
      </form>
    </Form>
  )
}

export interface FormFieldProps<T extends FieldValues> {
  /** Field name (must match form values type) */
  name: Path<T>
  /** Field label text */
  label?: string
  /** Field description text */
  description?: string
  /** Whether to show validation messages */
  showMessage?: boolean
  /** Whether to show error styling */
  showError?: boolean
  /** Field input component or render function */
  children: ReactElement | ((field: ControllerRenderProps<T, Path<T>>) => ReactElement)
  /** React Hook Form instance */
  form: UseFormReturn<T>
  /** Additional CSS classes for the field container */
  className?: string
  /** Additional CSS classes for the label */
  labelClassName?: string
}

/**
 * Form field component that handles field validation, error states, and layout.
 * Supports both direct children and render prop patterns.
 */
export function FormField<T extends FieldValues>({
  name,
  label = '',
  description = '',
  showMessage = false,
  showError = false,
  children,
  form,
  className,
  labelClassName,
}: FormFieldProps<T>) {
  return (
    <ShadcnFormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const errorClass =
          showError && fieldState.invalid ? 'border-red-500 focus-visible:ring-red-500' : ''

        const isSelectComponent = (element: React.ReactElement) => {
          if (element.type && typeof element.type === 'function' && 'displayName' in element.type) {
            return element.type.displayName === 'BaseSelect'
          }

          if (element.type && typeof element.type === 'function') {
            return element.type.name === 'BaseSelect'
          }

          return false
        }

        return (
          <FormItem className={cn('flex flex-col items-start', className)}>
            {label && (
              <FormLabel className={cn('text-[#1E1E1E]', labelClassName)} htmlFor={name}>
                {label}
              </FormLabel>
            )}
            <FormControl>
              {typeof children === 'function'
                ? children(field)
                : React.isValidElement(children)
                  ? React.cloneElement(children, {
                      ...field,
                      ...(isSelectComponent(children)
                        ? {
                            triggerClassName: cn(
                              errorClass,
                              (children.props as { triggerClassName?: string })?.triggerClassName ??
                                '',
                            ),
                          }
                        : {
                            className: cn(
                              errorClass,
                              (children.props as { className?: string })?.className ?? '',
                            ),
                          }),
                    } as React.HTMLAttributes<HTMLElement>)
                  : null}
            </FormControl>
            {description && (
              <FormDescription className='self-end uppercase text-xs font-light font-sf-pro-text text-mid-dark-gray'>
                {description}
              </FormDescription>
            )}
            {showMessage && <FormMessage className='text-end' />}
          </FormItem>
        )
      }}
    />
  )
}

interface FormFooterProps {
  /** Footer content (usually buttons) */
  children: ReactNode
  /** Additional CSS classes for the footer */
  className?: string
}

/**
 * Form footer component for consistent button layout and spacing.
 * Typically used to group submit/cancel buttons.
 */
export function FormFooter({ children, className }: FormFooterProps) {
  return <div className={cn('flex justify-end space-x-2', className)}>{children}</div>
}
