import { Pagination } from '@/components/shared/pagination'
import { useGetEventOrders } from '@/hooks/use-invite-ticket-mutations'
import { formatNaira } from '@/lib/format-price'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { ORDERS_PAGE_SIZE } from '../constant'
import type { EventOrdersData } from '@/types/invite-tickets'

/** Every order on the event, paged server-side. */
export function EventOrdersTable({ eventId }: { eventId: string }) {
  const [page, setPage] = useState(1)

  const { data, isPending, isFetching, isError } = useGetEventOrders(eventId, {
    pageNumber: page,
    pageSize: ORDERS_PAGE_SIZE,
  })

  const orders = data?.orders ?? []

  return (
    <div className='w-full flex flex-col gap-5 rounded-xl bg-white p-5'>
      <div className='flex items-center justify-between gap-4'>
        <div className='flex flex-col gap-1'>
          <p className='font-inter-tight text-xl font-semibold text-black'>Orders</p>
          <p className='font-inter-tight text-xs xl:text-sm font-medium text-mid-dark-gray'>
            Everyone who has bought tickets to this event.
          </p>
        </div>

        {isFetching && !isPending && (
          <LoaderCircle className='size-4 shrink-0 animate-spin text-mid-dark-gray' />
        )}
      </div>

      {isPending ? (
        <div className='flex justify-center py-10'>
          <LoaderCircle className='size-6 animate-spin text-deep-red' />
        </div>
      ) : isError ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          Couldn’t load orders. Please try again.
        </p>
      ) : orders.length === 0 ? (
        <p className='py-10 text-center font-inter-tight text-sm text-mid-dark-gray'>
          No orders yet.
        </p>
      ) : (
        // One card per order, on phones and desktop alike.
        <ul className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {orders.map((order) => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </ul>
      )}

      <Pagination
        page={data?.pageNumber ?? page}
        totalPages={data?.totalPages ?? 1}
        totalCount={data?.totalCount ?? orders.length}
        onPageChange={setPage}
        itemLabel={{ one: 'order', other: 'orders' }}
        isLoading={isFetching}
      />
    </div>
  )
}

/**
 * The buyer, the order code, a line per ticket type (quantity, name, what that
 * line cost) and, in green, the order's total: what the buyer paid, fee
 * included, so it can be more than the lines added up.
 */
function OrderCard({ order }: { order: EventOrdersData }) {
  return (
    <li className='flex min-w-0 flex-col gap-2.5 rounded-xl bg-white p-4 shadow-[0px_2px_10px_0px_#0000001A] font-inter-tight'>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-col gap-1'>
          <p className='truncate text-base text-black'>{order.customerName || '—'}</p>
          <p className='truncate text-[13px] text-mid-dark-gray'>{order.customerEmail}</p>
        </div>
        <p className='shrink-0 text-base font-semibold text-green'>
          {formatNaira(order.cost, { free: true })}
        </p>
      </div>

      {/* The readable code where there is one; the raw id is a GUID. */}
      <p className='text-[13px] font-semibold text-mid-dark-gray'>
        Order ID : {order.orderCode || order.orderId}
      </p>

      <ul className='flex flex-col gap-1'>
        {order.items?.length ? (
          order.items.map((item) => (
            <li key={item.ticketId} className='flex items-baseline justify-between gap-4 text-[13px] text-mid-dark-gray'>
              <span className='min-w-0'>
                X{item.quantity} {item.ticketName}
              </span>
              <span className='shrink-0 font-semibold'>
                {formatNaira(item.price * item.quantity, { free: true })}
              </span>
            </li>
          ))
        ) : (
          <li className='text-[13px] text-mid-dark-gray'>X{order.ticketCount}</li>
        )}
      </ul>
    </li>
  )
}
