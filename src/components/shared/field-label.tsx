import { cn } from '@/lib/utils'

/**
 * The one form-label style: small Work Sans capitals above the field, as the
 * shared FormField draws its labels. For fields that don't go through
 * FormField (settings, guestlist modals).
 */
export const FIELD_LABEL_CLASS = 'font-work-sans text-xs uppercase text-[#1E1E1E]'

/** The same label on the dark fan pages. */
export const FIELD_LABEL_ON_DARK_CLASS = 'font-work-sans text-xs uppercase text-white'

export function FieldLabel({
  htmlFor,
  className,
  children,
}: {
  htmlFor?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <label htmlFor={htmlFor} className={cn(FIELD_LABEL_CLASS, className)}>
      {children}
    </label>
  )
}
