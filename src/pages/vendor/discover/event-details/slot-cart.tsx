import { formatNaira } from '@/lib/format-price'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { RiArrowDownSLine, RiArrowUpSLine, RiErrorWarningLine, RiLoader4Line, RiShoppingCartLine } from 'react-icons/ri'
import { getCartItemTotal, getSlotTitle, type SlotCartItem } from './slot-request'

/**
 * "Your Slots": what the vendor will request. Styled like the fans' CartSummaryFloat:
 * a bar at the bottom with the Request button, which opens upward to list the slots.
 * Quantities change on the rows, as they do for tickets.
 */
export function SlotCart({ items, onRequest, isRequesting }: ISlotCart) {
  const [isOpen, setIsOpen] = useState(false)
  const count = items.reduce((sum, item) => sum + item.quantity, 0)
  const total = items.reduce((sum, item) => sum + getCartItemTotal(item), 0)

  // Opens whenever something is added, so the vendor sees it land. Removing doesn't.
  const [lastCount, setLastCount] = useState(count)
  if (count !== lastCount) {
    setLastCount(count)
    if (count > lastCount) setIsOpen(true)
  }

  return (
    <div className='fixed bottom-0 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:right-0 z-40 w-80'>
      <div className='bg-white rounded-t-xl shadow-2xl overflow-hidden'>
        {/* Expandable panel — grows upward from the bar */}
        <div
          className={cn(
            'transition-all duration-300 ease-in-out overflow-hidden',
            isOpen ? 'max-h-[460px]' : 'max-h-0',
          )}>
          <div className='flex items-center justify-between px-5 pt-5 pb-3 border-b border-white/10'>
            <p className='text-black font-inter-tight font-black md:text-2xl text-xl tracking-wide'>Your Slots</p>
            <div className='flex items-center gap-2'>
              <RiShoppingCartLine size={16} className='text-black' />
              <span className='bg-soft-gray text-white text-xs font-bold font-inter-tight rounded-full px-2 py-0.5 min-w-[20px] text-center'>
                {count}
              </span>
              <button
                type='button'
                aria-label='Hide your slots'
                onClick={() => setIsOpen(false)}
                className='text-black/60 hover:text-black/20 transition-colors'>
                <RiArrowDownSLine size={18} />
              </button>
            </div>
          </div>

          <div className='mx-4 mb-2 flex flex-col items-center gap-0.5 rounded-md border border-soft-gray px-3 py-2.5 font-inter-tight text-xs text-black'>
            <span className='flex items-center gap-1'>
              <RiErrorWarningLine className='size-4' />
              Fees
            </span>
            <span>Price Includes Fees.</span>
          </div>

          <ul className='flex flex-col px-4 gap-2 max-h-52 overflow-y-auto'>
            {items.length === 0 ? (
              <li className='px-5 py-4 text-black/40 text-xs font-inter-tight text-center'>No slots selected yet</li>
            ) : (
              items.map((item) => (
                <li
                  key={item.slot.vendorId}
                  className='flex items-center border border-soft-gray rounded-md justify-between gap-3 px-5 py-3'>
                  <div className='flex flex-row items-center gap-0.5 min-w-0'>
                    <p className='text-black md:text-base text-sm font-inter-tight mr-2'>×{item.quantity}</p>
                    <p className='text-black capitalize md:text-base text-sm font-inter-tight truncate'>
                      {getSlotTitle(item.slot)}
                    </p>
                  </div>
                  <span className='shrink-0 text-tech-blue text-base font-inter-tight font-medium'>
                    {formatNaira(getCartItemTotal(item) / item.quantity)}
                  </span>
                </li>
              ))
            )}
          </ul>

          <div className='md:px-5 px-3 md:py-4 py-2 border-t border-white/10'>
            <RequestButton onRequest={onRequest} isRequesting={isRequesting} count={count} total={total} />
          </div>
        </div>

        {/* Bottom bar — hidden when panel is open */}
        {!isOpen && (
          <div className='flex flex-col items-center w-full bg-white md:px-5 px-3 md:py-4 py-2'>
            <button
              type='button'
              aria-label='Show your slots'
              onClick={() => setIsOpen(true)}
              className='w-full flex justify-center md:pb-3 pb-2 hover:bg-white/5 transition-colors'>
              <RiArrowUpSLine size={18} className='text-black' />
            </button>
            <RequestButton onRequest={onRequest} isRequesting={isRequesting} count={count} total={total} />
          </div>
        )}
      </div>
    </div>
  )
}

function RequestButton({
  onRequest,
  isRequesting,
  count,
  total,
}: {
  onRequest: () => void
  isRequesting: boolean
  count: number
  total: number
}) {
  return (
    <button
      type='button'
      onClick={onRequest}
      disabled={isRequesting || count === 0}
      className='w-full flex items-center justify-between py-2 bg-[#1E1E1E] hover:bg-black px-3 rounded-lg font-inter-tight disabled:opacity-50 disabled:pointer-events-none transition-colors'>
      {isRequesting ? (
        <RiLoader4Line size={16} className='animate-spin mx-auto text-white' />
      ) : (
        <>
          <span className='text-white text-base font-semibold'>Request</span>
          <span className='text-soft-gray text-xl font-semibold'>{formatNaira(total)}</span>
        </>
      )}
    </button>
  )
}

interface ISlotCart {
  items: SlotCartItem[]
  onRequest: () => void
  isRequesting: boolean
}
