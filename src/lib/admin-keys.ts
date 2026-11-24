import type {
  AdminEventsParams,
  AdminListParams,
  AdminTransactionsParams,
  AdminUsersParams,
} from '@/types/admin'

export const adminKeys = {
  all: ['admin'] as const,
  users: () => [...adminKeys.all, 'users'] as const,
  userList: (params: AdminUsersParams) => [...adminKeys.users(), params] as const,
  events: () => [...adminKeys.all, 'events'] as const,
  eventList: (params: AdminEventsParams) => [...adminKeys.events(), params] as const,
  eventDetails: (eventId: string) => [...adminKeys.events(), 'details', eventId] as const,
  orders: () => [...adminKeys.all, 'orders'] as const,
  orderList: (params: AdminListParams) => [...adminKeys.orders(), params] as const,
  transactions: () => [...adminKeys.all, 'transactions'] as const,
  transactionList: (params: AdminTransactionsParams) => [...adminKeys.transactions(), params] as const,
  analytics: () => [...adminKeys.all, 'analytics'] as const,
  salesByMonth: () => [...adminKeys.all, 'sales-by-month'] as const,
  fees: () => [...adminKeys.all, 'fees'] as const,
  feeAudit: (feeType: string) => [...adminKeys.fees(), 'audit', feeType] as const,
}
