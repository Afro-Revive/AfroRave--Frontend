import { cn } from '@/lib/utils'

/**
 * A section's heading inside a form (Basic Info, Date & Time, Sales Channel).
 * One style for Create and Edit Event, which used to mix sizes, weights and
 * cases. Always uppercase, so the text can be typed in any case.
 */
export function FormSectionHeading({
  as: Tag = 'h2',
  className,
  children,
}: {
  as?: 'h2' | 'h3' | 'p'
  className?: string
  children: React.ReactNode
}) {
  return (
    <Tag className={cn('font-inter-tight font-black text-xl text-black uppercase', className)}>
      {children}
    </Tag>
  )
}
