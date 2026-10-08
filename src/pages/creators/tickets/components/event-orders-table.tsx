import { Pagination } from '@/components/shared/pagination'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useGetEventOrders } from '@/hooks/use-invite-ticket-mutations'
import { formatNaira } from '@/lib/format-price'
import { LoaderCircle } from 'lucide-react'
import { useState } from 'react'
import { ORDERS_PAGE_SIZE } from '../constant'
import { formatShortDate } from '../helper'

const ORDER_COLUMNS = ['Name', 'Order ID', 'Ticket', 'Amount', 'Date']

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
        <div className='w-full overflow-x-auto'>
          <Table className='w-full'>
            <TableCaption className='sr-only'>Orders for this event</TableCaption>

            <TableHeader>
              <TableRow className='hover:bg-transparent'>
                {ORDER_COLUMNS.map((label) => (
                  <TableHead
                    key={label}
                    className='font-inter-tight text-xs xl:text-sm font-medium text-[#0A0A0A]'>
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.orderId} className='font-inter-tight text-sm text-black align-top'>
                  <TableCell>
                    <span className='flex flex-col'>
                      <span>{order.customerName}</span>
                      <span className='text-xs text-mid-dark-gray'>{order.customerEmail}</span>
                    </span>
                  </TableCell>

                  {/* The readable code where there is one; the raw id is a GUID. */}
                  <TableCell className='font-mono text-xs'>
                    {order.orderCode || order.orderId}
                  </TableCell>

                  {/* One line per ticket type, since an order can hold several. */}
                  <TableCell>
                    <span className='flex flex-col gap-0.5'>
                      {order.items?.length ? (
                        order.items.map((item) => (
                          <span key={item.ticketId} className='whitespace-nowrap'>
                            {item.ticketName}{' '}
                            <span className='text-mid-dark-gray'>× {item.quantity}</span>
                          </span>
                        ))
                      ) : (
                        <span className='text-mid-dark-gray'>× {order.ticketCount}</span>
                      )}
                    </span>
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>
                    {formatNaira(order.cost, { free: true })}
                  </TableCell>

                  <TableCell className='whitespace-nowrap'>
                    {formatShortDate(order.purchaseDate)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
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
