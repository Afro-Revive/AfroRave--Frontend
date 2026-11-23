import { useAdminTransactions } from '@/hooks/use-admin'
import { formatNaira } from '@/lib/format-price'
import type { AdminTransaction, AdminTransactionCategory } from '@/types/admin'
import { DataTable, type Column } from './components/data-table'
import { formatDateTime } from './components/format'
import { FilterTabs, SearchBox } from './components/list-controls'
import { PageHeader } from './components/page-header'
import { StatusPill, type PillTone } from './components/status-pill'
import { useListParams } from './components/use-list-params'

const CATEGORIES: Record<AdminTransactionCategory, { label: string; tone: PillTone }> = {
  Funding: { label: 'Funding', tone: 'green' },
  Withdrawal: { label: 'Withdrawal', tone: 'amber' },
  Refund: { label: 'Refund', tone: 'blue' },
  ResalePurchase: { label: 'Resale purchase', tone: 'red' },
  ResalePayout: { label: 'Resale payout', tone: 'green' },
  WalletCredit: { label: 'Other credit', tone: 'gray' },
  WalletDebit: { label: 'Other debit', tone: 'gray' },
  Other: { label: 'Other', tone: 'gray' },
}

const CATEGORY_FILTERS: { value: AdminTransactionCategory | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'Funding', label: 'Funding' },
  { value: 'Withdrawal', label: 'Withdrawals' },
  { value: 'Refund', label: 'Refunds' },
  { value: 'ResalePurchase', label: 'Resale purchases' },
  { value: 'ResalePayout', label: 'Resale payouts' },
  { value: 'WalletCredit', label: 'Other credits' },
  { value: 'WalletDebit', label: 'Other debits' },
  { value: 'Other', label: 'Other' },
]

const MONEY_IN: AdminTransactionCategory[] = ['Funding', 'Refund', 'ResalePayout', 'WalletCredit']
const MONEY_OUT: AdminTransactionCategory[] = ['Withdrawal', 'ResalePurchase', 'WalletDebit']

/** Whether it added to the wallet or took from it. A refund's type is Refund, but it's money in. */
function walletDirection(transaction: AdminTransaction): 'in' | 'out' | null {
  if (MONEY_IN.includes(transaction.category)) return 'in'
  if (MONEY_OUT.includes(transaction.category)) return 'out'
  const type = transaction.transactionType.toLowerCase()
  if (type === 'credit') return 'in'
  if (type === 'debit') return 'out'
  return null
}

function TransactionStatus({ status }: { status: string }) {
  const lower = status.toLowerCase()
  if (lower === 'completed' || lower === 'success' || lower === 'successful') {
    return <StatusPill tone='green'>{status}</StatusPill>
  }
  if (lower === 'pending' || lower === 'processing') return <StatusPill tone='amber'>{status}</StatusPill>
  if (lower === 'failed' || lower === 'reversed') return <StatusPill tone='red'>{status}</StatusPill>
  return <StatusPill tone='gray'>{status || '—'}</StatusPill>
}

const columns: Column<AdminTransaction>[] = [
  {
    header: 'Category',
    cell: (transaction) => {
      const category = CATEGORIES[transaction.category] ?? { label: transaction.category, tone: 'gray' as const }
      return <StatusPill tone={category.tone}>{category.label}</StatusPill>
    },
  },
  {
    header: 'Amount',
    cell: (transaction) => {
      const direction = walletDirection(transaction)
      return (
        <span className={direction === 'in' ? 'text-emerald-300' : undefined}>
          {direction === 'in' ? '+' : direction === 'out' ? '−' : ''}
          {formatNaira(transaction.amount)}
        </span>
      )
    },
    className: 'whitespace-nowrap text-right font-medium tabular-nums',
  },
  { header: 'Status', cell: (transaction) => <TransactionStatus status={transaction.status} /> },
  {
    header: 'Description',
    cell: (transaction) => <span className='text-white/80'>{transaction.description || '—'}</span>,
    className: 'min-w-[260px]',
  },
  {
    header: 'User',
    cell: (transaction) => <span className='whitespace-nowrap text-white/80'>{transaction.userEmail || '—'}</span>,
  },
  {
    header: 'Date',
    cell: (transaction) => formatDateTime(transaction.createdDate),
    className: 'whitespace-nowrap text-white/70',
  },
  {
    header: 'Reference',
    cell: (transaction) => (
      <span className='font-mono text-xs text-white/50' title={`Transaction ${transaction.transactionId}`}>
        {transaction.reference || transaction.transactionId.slice(0, 8)}
      </span>
    ),
  },
]

export default function AdminTransactionsPage() {
  const list = useListParams<AdminTransactionCategory>('category')
  const { data, isLoading, isFetching, isError } = useAdminTransactions({
    pageNumber: list.pageNumber,
    pageSize: list.pageSize,
    searchQuery: list.searchQuery,
    category: list.filter || undefined,
  })

  return (
    <>
      <PageHeader
        title='Transactions'
        description='The wallet ledger: top-ups, withdrawals, refunds and resale money, newest first. Card payments for tickets aren’t here; see Orders.'>
        <SearchBox
          value={list.searchText}
          onChange={list.setSearchText}
          placeholder='Search description or email'
        />
      </PageHeader>

      <FilterTabs label='Category' value={list.filter} options={CATEGORY_FILTERS} onChange={list.setFilter} />

      <DataTable
        columns={columns}
        page={data?.data}
        rowKey={(transaction) => transaction.transactionId}
        isLoading={isLoading}
        isFetching={isFetching}
        isError={isError}
        emptyMessage={
          list.searchQuery || list.filter ? 'No transactions match these filters.' : 'No transactions yet.'
        }
        onPageChange={list.setPage}
      />
    </>
  )
}
