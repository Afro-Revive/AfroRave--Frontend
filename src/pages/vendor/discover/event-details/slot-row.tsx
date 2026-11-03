import BaseModal from '@/components/reusable/base-modal'
import { RichTextContent } from '@/components/reusable/rich-text-content'
import { Button } from '@/components/ui/button'
import { stripUnderscores } from '@/lib/helper-func'
import { cn } from '@/lib/utils'
import type { VendorSlot } from '@/types/vendor'
import { useState } from 'react'
import type { IconType } from 'react-icons'
import { BsInfoCircle } from 'react-icons/bs'
import { RiAddLine, RiSubtractLine } from 'react-icons/ri'
import { formatShortDateTime } from '../../lib/format-date'
import {
  getSlotAvailability,
  getSlotDeadline,
  getSlotPriceLabel,
  getSlotsLeft,
  getSlotTitle,
  isRevenueSlot,
  type SlotAvailability,
} from './slot-request'

const UNAVAILABLE_LABELS: Record<Exclude<SlotAvailability, 'open'>, string> = {
  closed: 'Closed',
  paused: 'Paused',
  sold_out: 'Sold out',
}

/**
 * One row in Available Slots, styled like the fans' TicketCard (event page and cart) so
 * the two read the same. Tapping the row opens the slot's details; revenue slots count up
 * and down in the green pill, service offers take a proposed price first. A slot the vendor
 * has already requested is read only: no details, no counter, just a Requested pill.
 */
export function SlotRow({ slot, eventEnded, quantityInCart, isRequested, onAddRevenue, onAddService, onDecrease }: ISlotRow) {
  const [showDetails, setShowDetails] = useState(false)
  const isRevenue = isRevenueSlot(slot)
  const availability = getSlotAvailability(slot, eventEnded)
  const slotsLeft = getSlotsLeft(slot)
  const title = getSlotTitle(slot)

  const rowProps = isRequested
    ? {}
    : {
        role: 'button',
        tabIndex: 0,
        'aria-label': `About ${title}`,
        onClick: () => setShowDetails(true),
        onKeyDown: (event: React.KeyboardEvent<HTMLDivElement>) => {
          if (event.target !== event.currentTarget) return
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setShowDetails(true)
          }
        },
      }

  return (
    <>
      <div
        {...rowProps}
        className={cn(
          'w-full flex flex-wrap items-center justify-between gap-4 h-fit pl-5 pr-2 py-4 text-xl font-inter-tight',
          !isRequested && 'cursor-pointer transition-colors hover:bg-white/5',
        )}>
        <div className='flex items-start gap-3 min-w-0'>
          <BsInfoCircle aria-hidden='true' className='w-5 h-5 shrink-0 mt-0.5 text-white' />

          <div className='flex flex-col gap-1 font-inter-tight font-normal min-w-0'>
            <p className='md:text-base text-sm font-bold capitalize'>{title}</p>
              <p className='text-sm text-white font-medium capitalize'>{stripUnderscores(slot.category || slot.vendorCategory)}</p>
            <div className='flex flex-row items-center gap-2'>
              <p className='text-sm font-medium text-tech-blue'>{getSlotPriceLabel(slot)}</p>
              <p className='text-xs text-[#ACACAC]'>{isRevenue ? '(includes fees)' : '(budget)'}</p>
            </div>
          
          </div>
        </div>

        {/* stopPropagation so using the counter doesn't also open the details. */}
        <div onClick={(event) => event.stopPropagation()} className='shrink-0 ml-auto'>
          {isRequested ? (
            <span className='flex items-center justify-center font-inter-tight pr-4 text-xs font-bold uppercase tracking-wide text-tech-blue'>
              Requested
            </span>
          ) : availability !== 'open' ? (
            <StatusPill label={UNAVAILABLE_LABELS[availability]} />
          ) : quantityInCart > 0 ? (
            <Counter
              label={title}
              count={quantityInCart}
              onDecrease={onDecrease}
              // A service is one offer; its price is set when it's added.
              onIncrease={isRevenue ? onAddRevenue : undefined}
              atLimit={!isRevenue || quantityInCart >= slotsLeft}
            />
          ) : isRevenue ? (
            <Counter label={title} count={0} onIncrease={onAddRevenue} atLimit={slotsLeft <= 0} />
          ) : (
            <ServicePriceInput slot={slot} onAdd={onAddService} />
          )}
        </div>
      </div>

      {!isRequested && (
        <SlotDetailsModal slot={slot} availability={availability} open={showDetails} onClose={() => setShowDetails(false)} />
      )}
    </>
  )
}

function Counter({
  label,
  count,
  onIncrease,
  onDecrease,
  atLimit,
}: {
  label: string
  count: number
  onIncrease?: () => void
  onDecrease?: () => void
  atLimit: boolean
}) {
  return (
    <div className='flex items-center gap-2 px-3 rounded-full h-12 bg-light-green'>
      {count > 0 && (
        <>
          <CounterButton label={`Remove one ${label}`} action={onDecrease} Icon={RiSubtractLine} />
          <span className='font-sf-pro-rounded font-bold text-sm'>{count}</span>
        </>
      )}
      <CounterButton label={`Add ${label}`} action={onIncrease} Icon={RiAddLine} disabled={atLimit} />
    </div>
  )
}

function CounterButton({
  label,
  action,
  Icon,
  disabled = false,
  type = 'button',
}: {
  label: string
  action?: () => void
  Icon: IconType
  disabled?: boolean
  type?: 'button' | 'submit'
}) {
  return (
    <Button
      type={type}
      aria-label={label}
      disabled={disabled}
      variant='ghost'
      className='p-1 w-fit h-fit hover:bg-black/10'
      onClick={action}>
      <Icon color='var(--foreground)' size={16} />
    </Button>
  )
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className='flex items-center justify-center h-12 px-5 rounded-full bg-mid-dark-gray font-sf-pro-rounded text-xs font-bold uppercase tracking-wide text-white/60'>
      {label}
    </span>
  )
}

function ServicePriceInput({ slot, onAdd }: { slot: VendorSlot; onAdd: (price: number) => void }) {
  const [value, setValue] = useState('')
  const service = slot.vendorDetails?.serviceData
  const maxBudget = service?.hasBudgetRange ? service.maxBudget : undefined
  const price = Number(value)
  const isValid = value !== '' && price > 0

  return (
    <form
      className='flex items-center gap-2'
      onSubmit={(e) => {
        e.preventDefault()
        if (!isValid) return
        onAdd(price)
        setValue('')
      }}>
      <span aria-hidden className='flex size-10 shrink-0 items-center justify-center rounded-full bg-[#5A5A5A] text-sm font-bold text-white'>
        ₦
      </span>
      <label className='w-[150px] sm:w-[200px]'>
        <span className='sr-only'>Your price for {getSlotTitle(slot)}</span>
        <input
          type='number'
          inputMode='numeric'
          min={1}
          max={maxBudget}
          value={value}
          onChange={(e) => {
            const next = e.target.value
            if (next === '') return setValue('')
            const parsed = Number(next)
            if (Number.isNaN(parsed) || parsed < 0) return
            setValue(String(maxBudget ? Math.min(parsed, maxBudget) : parsed))
          }}
          placeholder='Enter your price'
          className='h-8 w-full rounded-lg border border-white bg-transparent px-2.5 font-inter-tight text-sm text-white outline-none [appearance:textfield] placeholder:text-[#9A9A9A] focus:border-tech-blue [&::-webkit-inner-spin-button]:appearance-none'
        />
      </label>
      <button
        type='submit'
        aria-label={`Add ${getSlotTitle(slot)}`}
        disabled={!isValid}
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-full text-white transition-colors disabled:cursor-not-allowed',
          isValid ? 'bg-light-green hover:opacity-90' : 'bg-[#5A5A5A]',
        )}>
        <RiAddLine className='size-6' />
      </button>
    </form>
  )
}

/** Same modal as a fan's ticket details: name, price, description, then the slot's terms. */
function SlotDetailsModal({
  slot,
  availability,
  open,
  onClose,
}: {
  slot: VendorSlot
  availability: SlotAvailability
  open: boolean
  onClose: () => void
}) {
  const isRevenue = isRevenueSlot(slot)
  const deadline = formatShortDateTime(getSlotDeadline(slot))
  const service = slot.vendorDetails?.serviceData

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      size='small'
      title={<span className='font-inter-tight font-bold md:text-2xl text-xl normal-case'>{getSlotTitle(slot)}</span>}
      titleClassName='items-start px-6 '
      className='bg-system-black border border-white/10'>
      <div className='flex flex-col gap-2 px-6 pb-6 font-inter-tight'>
        <div className='flex items-center gap-2'>
          {availability !== 'open' ? (
            <StatusPill label={UNAVAILABLE_LABELS[availability]} />
          ) : (
            <>
              <p className='text-base text-tech-blue'>{getSlotPriceLabel(slot)}</p>
              <p className='text-xs text-[#ACACAC]'>{isRevenue ? '(includes fees)' : '(budget)'}</p>
            </>
          )}
        </div>

        {slot.description ? (
          <div className='flex flex-col gap-1'>
            <p className='font-inter-tight font-bold text-2xl text-white'>Description</p>
            <RichTextContent value={slot.description} className='text-sm text-white/80' />
          </div>
        ) : (
          <p className='text-sm text-white'>No description provided for this slot.</p>
        )}

        <dl className='mt-2 flex flex-col gap-1.5 border-t border-white/10 pt-3 text-sm'>
          {isRevenue ? (
            <InfoRow name='Slots left' value={getSlotsLeft(slot)} />
          ) : (
            service?.startTime && <InfoRow name='Work hours' value={`${service.startTime} - ${service.stopTime}`} />
          )}
          {deadline && <InfoRow name='Apply by' value={deadline} />}
        </dl>
      </div>
    </BaseModal>
  )
}

function InfoRow({ name, value }: { name: string; value: React.ReactNode }) {
  return (
    <div className='flex justify-between gap-4'>
      <dt className='text-[#ACACAC]'>{name}</dt>
      <dd className='text-right text-white'>{value}</dd>
    </div>
  )
}

interface ISlotRow {
  slot: VendorSlot
  eventEnded: boolean
  quantityInCart: number
  /** The vendor already has a request in review, approved or secured for this slot. */
  isRequested: boolean
  onAddRevenue: () => void
  onAddService: (price: number) => void
  /** One fewer stall, or the service offer taken out. */
  onDecrease: () => void
}
