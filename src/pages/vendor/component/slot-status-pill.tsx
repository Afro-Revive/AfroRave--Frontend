import { cn } from '@/lib/utils'
import type { IconType } from 'react-icons'
import { RiCheckboxCircleLine, RiEyeLine, RiShieldCheckLine } from 'react-icons/ri'
import type { SlotStatus } from '../slots/slot-status'

const STATUS_STYLES: Record<SlotStatus, { label: string; className: string; Icon?: IconType }> = {
  in_review: { label: 'In Review...', className: 'bg-[#0A2D5C] text-[#3D8BFF]', Icon: RiEyeLine },
  approved: { label: 'Approved', className: 'bg-[#5C3A00] text-orange-peel', Icon: RiCheckboxCircleLine },
  secured: { label: 'Slot Secured', className: 'bg-[#0D3B14] text-[#34C759]', Icon: RiShieldCheckLine },
  rejected: { label: 'Rejected', className: 'bg-[#3A3A3A] text-[#A3A3A3]' },
  expired: { label: 'Expired', className: 'bg-[#3A3A3A] text-[#A3A3A3]' },
  completed: { label: 'Completed', className: 'bg-[#3A3A3A] text-[#A3A3A3]' },
}

export function SlotStatusPill({ status, className }: { status: SlotStatus; className?: string }) {
  const { label, className: statusClassName, Icon } = STATUS_STYLES[status]

  return (
    <span
      className={cn(
        'inline-flex w-fit items-center gap-1 rounded-md px-2 py-1 font-inter-tight text-xs leading-none whitespace-nowrap',
        statusClassName,
        className,
      )}>
      {Icon && <Icon className='size-3 shrink-0' />}
      {label}
    </span>
  )
}

/** "Revenue vendor" / "Service vendor" tag beside a slot's title. */
export function VendorTypeTag({ isRevenue, className }: { isRevenue: boolean; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex w-fit items-center rounded-md px-2.5 py-1 font-inter-tight text-xs whitespace-nowrap',
        isRevenue ? 'bg-[#5C3A00] text-orange-peel' : 'bg-[#0A2D5C] text-[#3D8BFF]',
        className,
      )}>
      {isRevenue ? 'Revenue vendor' : 'Service vendor'}
    </span>
  )
}
