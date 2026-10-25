import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import type { AnalyticsPromoCode, PromoCodeData } from '@/types'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { PartnershipTag } from './partnership-tag'

/** "20% off" or "₦5,000 off", from the code's discount type. */
function promoDiscountLabel(promocode: Pick<PromoCodeData, 'discountType' | 'discountValue'>) {
  return promocode.discountType === 'Percentage'
    ? `${promocode.discountValue}% off`
    : `${formatNaira(promocode.discountValue ?? 0)} off`
}


export function PromoCodeCard({
  promocode,
  stats,
  isUsageLoading = false,
  onOpen,
  onEdit,
  onDelete,
  isDeleting = false,
}: {
  promocode: PromoCodeData
  /** This code's analytics: redemptions, sales, commission. Missing until it's been used. */
  stats?: AnalyticsPromoCode
  isUsageLoading?: boolean
  onOpen: () => void
  onEdit: () => void
  onDelete: () => void
  isDeleting?: boolean
}) {
  // discountUsage is the code's usage limit.
  const total = promocode.discountUsage ?? 0
  const redeemed = stats?.uses ?? 0
  const percentUsed = total > 0 ? Math.min((redeemed / total) * 100, 100) : 0
  const isUsedUp = total > 0 && redeemed >= total
  const isPartnership = promocode.promoDetails?.isPartnership ?? false

  return (
    <div
      role='button'
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        'w-full flex flex-col gap-4 rounded-xl border border-gray-100 bg-white px-4 py-4 shadow-sm cursor-pointer transition-colors hover:border-gray-300 md:px-5',
        // In the page's two-column grid, a partnership code carries its
        // partner's numbers, so it spans both columns.
        isPartnership && 'md:col-span-2',
      )}>

      {/* Top row: the code and discount, with the actions at the top-right. */}
      <div className='flex w-full items-start justify-between gap-2'>
        <div className='flex min-w-0 flex-1 flex-col gap-1'>
          <div className='flex min-w-0 flex-row items-center gap-2'>
            <p className='truncate font-inter-tight text-base font-bold uppercase text-black'>
              {promocode.promoCode}
            </p>
            <p className='font-inter-tight text-sm font-medium text-soft-gray'>
              {promoDiscountLabel(promocode)}
            </p>
          </div>
          {isPartnership && <PartnershipTag />}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              aria-label={`More options for ${promocode.promoCode}`}
              className='p-1 !w-fit h-fit shrink-0 hover:bg-black/10'
              onClick={(event) => event.stopPropagation()}>
              <EllipsisVertical className='size-4' color='#000000' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' onClick={(event) => event.stopPropagation()}>
            <DropdownMenuItem onClick={onEdit}>
              <Pencil size={16} className='mr-2' />
              Edit Promo Code
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={onDelete}
              disabled={isDeleting}
              className='text-deep-red focus:text-deep-red'>
              <Trash2 size={16} className='mr-2' />
              {isDeleting ? 'Deleting...' : 'Delete Promo Code'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className='flex w-[120px] shrink-0 flex-col items-start gap-1.5 md:w-[160px]'>
        <p className='font-inter-tight text-xs text-mid-dark-gray'>Used</p>
        {isUsageLoading ? (
          <span className='h-5 w-16 rounded bg-black/10 animate-pulse' />
        ) : (
          <p className='font-inter-tight text-sm text-black'>
            <span className='font-bold'>{redeemed}</span> / {total}
          </p>
        )}
        <div
          role='progressbar'
          aria-label={`${promocode.promoCode} usage`}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-valuenow={redeemed}
          className='h-1.5 w-full overflow-hidden rounded-full bg-[#F2F2F2]'>
          <div
            className={cn('h-full rounded-full', isUsedUp ? 'bg-deep-red' : 'bg-green')}
            style={{ width: `${percentUsed}%` }}
          />
        </div>
      </div>

      {isPartnership && (
        <div className='grid grid-cols-1 gap-3 sm:grid-cols-3'>
          <PartnershipStat label='Tickets Sold' isLoading={isUsageLoading}>
            {redeemed.toLocaleString()}
          </PartnershipStat>
          <PartnershipStat label='Revenue Generated' isLoading={isUsageLoading}>
            {formatNaira(stats?.grossSales ?? 0)}
          </PartnershipStat>
          <PartnershipStat label='Commission Earned' isLoading={isUsageLoading}>
            {formatNaira(stats?.commissions ?? 0)}
          </PartnershipStat>
        </div>
      )}
    </div>
  )
}

/** One of a partnership code's numbers, in a small grey card. */
function PartnershipStat({
  label,
  isLoading,
  children,
}: {
  label: string
  isLoading: boolean
  children: React.ReactNode
}) {
  return (
    <div className='flex flex-col gap-1 rounded-lg bg-[#F2F2F2] px-4 py-3'>
      <p className='font-inter-tight text-sm font-bold text-black'>{label}</p>
      {isLoading ? (
        <span className='h-6 w-20 rounded bg-black/10 animate-pulse' />
      ) : (
        <p className='font-inter-tight text-lg font-bold text-black'>{children}</p>
      )}
    </div>
  )
}
