import { cn } from '@/lib/utils'

/** Marks a promo code made for a partner, who earns commission on it. */
export function PartnershipTag({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'w-fit  font-inter-tight text-xs text-green',
        className,
      )}>
      Partnership Code
    </span>
  )
}
