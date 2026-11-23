import { getRoutePath } from '@/config/get-route-path'
import { adminKeys } from '@/lib/admin-keys'
import { feeKeys } from '@/lib/fee-keys'
import { apiErrorMessage } from '@/lib/api-error'
import { adminService } from '@/services/admin.service'
import { useAfroStore } from '@/stores'
import type {
  AdminEventsParams,
  AdminListParams,
  AdminOrder,
  AdminTransactionsParams,
  AdminUsersParams,
} from '@/types/admin'
import type { LoginData } from '@/types/auth'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

/**
 * Logs in at /admin/login. Only an Admin account is kept: any other account is
 * refused before it's saved, so a fan can't end up signed in from here.
 */
export function useAdminLogin() {
  const queryClient = useQueryClient()
  const setAuth = useAfroStore((state) => state.setAuth)
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await adminService.login(data)
      if (response.userData?.accountType !== 'Admin') {
        throw new Error('This account is not an admin account.')
      }
      return response
    },
    onSuccess: (response) => {
      setAuth(response.userData, response.token, response.refreshToken)
      // Nothing cached belongs to this account.
      void queryClient.resetQueries()
      navigate(getRoutePath('admin_dashboard'), { replace: true })
    },
    onError: (error) => {
      toast.error(isAxiosError(error) ? apiErrorMessage(error, 'Could not log in.') : error.message)
    },
  })
}

export function useAdminUsers(params: AdminUsersParams) {
  return useQuery({
    queryKey: adminKeys.userList(params),
    queryFn: () => adminService.getUsers(params),
    placeholderData: keepPreviousData,
  })
}

export function useAdminEvents(params: AdminEventsParams) {
  return useQuery({
    queryKey: adminKeys.eventList(params),
    queryFn: () => adminService.getEvents(params),
    placeholderData: keepPreviousData,
  })
}

export function useAdminEventDetails(eventId?: string) {
  return useQuery({
    queryKey: adminKeys.eventDetails(eventId ?? ''),
    queryFn: () => adminService.getEventDetails(eventId ?? ''),
    enabled: !!eventId,
    // An unknown id stays unknown.
    retry: false,
  })
}

export function useAdminOrders(params: AdminListParams) {
  return useQuery({
    queryKey: adminKeys.orderList(params),
    queryFn: () => adminService.getOrders(params),
    placeholderData: keepPreviousData,
  })
}

export function useAdminTransactions(params: AdminTransactionsParams) {
  return useQuery({
    queryKey: adminKeys.transactionList(params),
    queryFn: () => adminService.getTransactions(params),
    placeholderData: keepPreviousData,
  })
}

/** The dashboard's counts and money, all time. */
export function useAdminAnalytics() {
  return useQuery({
    queryKey: adminKeys.analytics(),
    queryFn: () => adminService.getAnalytics(),
    staleTime: 60 * 1000,
  })
}

const CHART_MONTHS = 6
/** Orders read for the chart, at most this many pages of 100. */
const CHART_ORDER_PAGES = 50
const CHART_PAGE_SIZE = 100

export interface MonthSales {
  month: string
  sales: number
  orders: number
}

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

/**
 * Completed orders' sales for each of the last six months, oldest first.
 * /analytics has no figures over time, so this reads orders (newest first)
 * until it passes the start of the window.
 */
export function useSalesByMonth() {
  return useQuery({
    queryKey: adminKeys.salesByMonth(),
    queryFn: async (): Promise<{ months: MonthSales[]; complete: boolean }> => {
      const now = new Date()
      const windowStart = new Date(now.getFullYear(), now.getMonth() - (CHART_MONTHS - 1), 1)
      const months = Array.from({ length: CHART_MONTHS }, (_, index) => {
        const date = new Date(windowStart.getFullYear(), windowStart.getMonth() + index, 1)
        return { key: monthKey(date), month: date.toLocaleString(undefined, { month: 'short' }), sales: 0, orders: 0 }
      })
      const byKey = new Map(months.map((month) => [month.key, month]))

      const add = (order: AdminOrder) => {
        if (order.status !== 'Completed') return
        const month = byKey.get(monthKey(new Date(order.purchaseDate)))
        if (!month) return
        month.sales += order.cost
        month.orders += 1
      }

      let complete = false
      for (let pageNumber = 1; pageNumber <= CHART_ORDER_PAGES; pageNumber++) {
        const { data } = await adminService.getOrders({ pageNumber, pageSize: CHART_PAGE_SIZE })
        data.items.forEach(add)
        const oldest = data.items.at(-1)
        if (!data.hasNext || (oldest && new Date(oldest.purchaseDate) < windowStart)) {
          complete = true
          break
        }
      }

      return { months: months.map(({ month, sales, orders }) => ({ month, sales, orders })), complete }
    },
    staleTime: 60 * 1000,
  })
}

/** Suspends or reactivates a user. Sets the state, so repeating it is harmless. */
export function useSetUserSuspension() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, isSuspended }: { userId: string; isSuspended: boolean }) =>
      adminService.setUserSuspension(userId, isSuspended),
    onSuccess: (response) => {
      toast.success(response.data.isSuspended ? 'User suspended.' : 'User reactivated.')
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the user.')),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics() })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => adminService.deleteUser(userId),
    onSuccess: (response) => {
      if (response.data.outcome === 'Deactivated') {
        // Records it depends on had to stay, so the backend kept the account, switched off.
        toast.warning("The account couldn't be deleted, so it was deactivated instead.")
      } else {
        toast.success('User deleted.')
      }
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not delete the user.')),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.users() })
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics() })
    },
  })
}

/** Suspends or unsuspends an event. Sets the state, so repeating it is harmless. */
export function useSetEventSuspension() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ eventId, isSuspended }: { eventId: string; isSuspended: boolean }) =>
      adminService.setEventSuspension(eventId, isSuspended),
    onSuccess: (response) => {
      toast.success(
        response.data.isSuspended
          ? 'Event suspended and unpublished.'
          : 'Event unsuspended. It stays a draft until the organizer publishes it.',
      )
    },
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the event.')),
    onSettled: () => {
      // The list and any open details.
      queryClient.invalidateQueries({ queryKey: adminKeys.events() })
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics() })
    },
  })
}

export function useRefundOrder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => adminService.refundOrder(orderId),
    onSuccess: () => toast.success("Order refunded to the buyer's wallet."),
    // The server explains refusals (resale, transferred, checked in): show it as it is.
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not refund the order.')),
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.orders() })
      queryClient.invalidateQueries({ queryKey: adminKeys.transactions() })
      queryClient.invalidateQueries({ queryKey: adminKeys.analytics() })
      queryClient.invalidateQueries({ queryKey: adminKeys.salesByMonth() })
    },
  })
}

export function useAdminFees() {
  return useQuery({
    queryKey: adminKeys.fees(),
    queryFn: () => adminService.getFees(),
  })
}

export function useFeeAudit(feeType: string, enabled: boolean) {
  return useQuery({
    queryKey: adminKeys.feeAudit(feeType),
    queryFn: () => adminService.getFeeAudit(feeType),
    enabled,
  })
}

export function useUpdateFee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ feeType, percentageValue }: { feeType: string; percentageValue: number }) =>
      adminService.updateFee({ feeType, percentageValue, fixedValue: 0 }),
    onSuccess: () => toast.success('Fee updated.'),
    onError: (error) => toast.error(apiErrorMessage(error, 'Could not update the fee.')),
    onSettled: (_, __, { feeType }) => {
      queryClient.invalidateQueries({ queryKey: adminKeys.fees() })
      queryClient.invalidateQueries({ queryKey: adminKeys.feeAudit(feeType) })
      // The public fees the fan and vendor screens read, when the admin is on the main site.
      queryClient.invalidateQueries({ queryKey: feeKeys.all })
    },
  })
}
