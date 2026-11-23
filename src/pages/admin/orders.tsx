import { useAdminOrders, useRefundOrder } from '@/hooks/use-admin'
import { formatNaira } from '@/lib/format-price'
import type { AdminOrder } from '@/types/admin'
import { useState } from 'react'
import { ConfirmDialog } from './components/confirm-dialog'
import { DataTable, type Column } from './components/data-table'
import { formatDateTime, paymentMethodLabel } from './components/format'
import { RowAction, SearchBox } from './components/list-controls'
import { PageHeader } from './components/page-header'
import { StatusPill } from './components/status-pill'
import { useListParams } from './components/use-list-params'

function OrderStatus({ status }: { status: string }) {
  if (status === 'Completed') return <StatusPill tone='green'>Completed</StatusPill>
  if (status === 'Refunded') return <StatusPill tone='amber'>Refunded</StatusPill>
  return <StatusPill tone='gray'>{status || '—'}</StatusPill>
}

export default function AdminOrdersPage() {
  const list = useListParams()
  const { data, isLoading, isFetching, isError } = useAdminOrders({
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    searchQuery: list.searchQuery,
  })
  const refund = useRefundOrder()
  const [pending, setPending] = useState<AdminOrder | null>(null)

  const columns: Column<AdminOrder>[] = [
    { header: 'Order', cell: (order) => <span className='font-mono text-xs'>{order.orderCode}</span> },
    { header: 'Buyer', cell: (order) => <span className='whitespace-nowrap text-white/80'>{order.userEmail || '—'}</span> },
    { header: 'Tickets', cell: (order) => order.ticketCount, className: 'text-right' },
    {
      header: 'Total',
      cell: (order) => formatNaira(order.cost, { free: true }),
      className: 'whitespace-nowrap text-right font-medium',
    },
    { header: 'Tax', cell: (order) => formatNaira(order.tax), className: 'whitespace-nowrap text-right text-white/70' },
    { header: 'Payment', cell: (order) => paymentMethodLabel(order.paymentMethod), className: 'whitespace-nowrap' },
    { header: 'Status', cell: (order) => <OrderStatus status={order.status} /> },
    {
      header: 'Purchased',
      cell: (order) => formatDateTime(order.purchaseDate),
      className: 'whitespace-nowrap text-white/70',
    },
    {
      header: 'Actions',
      className: 'text-right',
      cell: (order) =>
        order.status === 'Completed' ? (
          <RowAction tone='danger' onClick={() => setPending(order)}>
            Refund
          </RowAction>
        ) : (
          <span className='text-xs text-white/40'>—</span>
        ),
    },
  ]

  const closeDialog = () => setPending(null)

  return (
    <>
      <PageHeader title='Orders' description='Every ticket order, newest first. Refunds go to the buyer’s wallet.'>
        <SearchBox value={list.searchText} onChange={list.setSearchText} placeholder='Search order code or email' />
      </PageHeader>

      <DataTable
        columns={columns}
        page={data?.data}
        rowKey={(order) => order.orderId}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        emptyMessage={list.searchQuery ? 'No orders match that search.' : 'No orders yet.'}
        onPageChange={list.setPage}
      />

      {pending && (
        <ConfirmDialog
          open
          title={`Refund order ${pending.orderCode}?`}
          description={
            <>
              <p>
                <span className='text-white'>{formatNaira(pending.cost)}</span> goes back to{' '}
                <span className='break-all text-white'>{pending.userEmail}</span>&rsquo;s Afrorevive wallet, not
                their card. Their {pending.ticketCount === 1 ? 'ticket is' : `${pending.ticketCount} tickets are`}{' '}
                voided and put back on sale.
              </p>
              <p className='text-white/50'>
                Orders with resale, transferred or checked-in tickets can&rsquo;t be refunded here; the server
                will say so.
              </p>
            </>
          }
          confirmLabel='Refund order'
          isPending={refund.isPending}
          onClose={closeDialog}
          onConfirm={() => refund.mutate(pending.orderId, { onSettled: closeDialog })}
        />
      )}
    </>
  )
}
