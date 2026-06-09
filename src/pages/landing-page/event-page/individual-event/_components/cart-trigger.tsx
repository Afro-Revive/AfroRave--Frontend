import { useGetAllCart } from '@/hooks/use-cart'
import { useAfroStore, useCartStore } from '@/stores'
import { cn } from '@/lib/utils'
import type { EventDetailData } from '@/types'
import { LoaderCircle, ShoppingCart } from 'lucide-react'
import Cart from '../../cart'

export default function CartTrigger({ event, className }: ICartTriggerProps) {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const localItems = useCartStore((state) => state.items)
  const { data, isLoading } = useGetAllCart()

  const totalTickets = isAuthenticated
    ? (data?.data ?? []).reduce((sum, item) => sum + (item.quantity ?? 0), 0)
    : localItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className={cn('flex gap-4 ', className)}>
      <div className='flex h-fit gap-[11px] py-4 px-2 rounded-[6px] bg-deep-red'>
        <ShoppingCart size={24} color='#ffffff' />

        <p className='h-6 rounded-full bg-white px-3 text-sm font-semibold font-sf-pro-display text-black flex items-center justify-center'>
          {isAuthenticated && isLoading ? (
            <LoaderCircle color='#000000' size={14} className='animate-spin' />
          ) : (
            totalTickets
          )}
        </p>
      </div>
      <div className='w-full'>
        <Cart event={event} />
      </div>
    </div>
  )
}

interface ICartTriggerProps {
  event: EventDetailData
  className?: string
}
