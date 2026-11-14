import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/lib/utils'

// forwardRef: on React 18 a ref isn't a plain prop, and form fields pass one.
const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(function Checkbox({ className, ...props }, ref) {
  return (
    <CheckboxPrimitive.Root
      ref={ref}
      data-slot='checkbox'
      className={cn(
        'peer text-[#1E1E1E]    data-[state=checked]:bg-light-red data-[state=checked]:text-primary-foreground  data-[state=checked]:border-secondary  aria-invalid:border-secondary size-4 shrink-0 rounded-[4px] border border-secondary/30  outline-none focus-visible:ring-[3px] hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}>
      <CheckboxPrimitive.Indicator
        data-slot='checkbox-indicator'
        className='flex items-center justify-center text-current transition-none'>
        <CheckIcon className='size-3.5' />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
})

export { Checkbox }
