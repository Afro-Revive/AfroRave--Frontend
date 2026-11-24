import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'
import { getRoutePath } from './get-route-path'

const DashboardPage = lazy(() => import('../pages/admin/dashboard'))
const UsersPage = lazy(() => import('../pages/admin/users'))
const EventsPage = lazy(() => import('../pages/admin/events'))
const OrdersPage = lazy(() => import('../pages/admin/orders'))
const TransactionsPage = lazy(() => import('../pages/admin/transactions'))
const FeesPage = lazy(() => import('../pages/admin/fees'))

/** Inside AdminLayout, which checks the account is an Admin and holds the Suspense. */
export const admin_routes: RouteObject[] = [
  { path: getRoutePath('admin_dashboard'), element: <DashboardPage /> },
  { path: getRoutePath('admin_users'), element: <UsersPage /> },
  { path: getRoutePath('admin_events'), element: <EventsPage /> },
  { path: getRoutePath('admin_orders'), element: <OrdersPage /> },
  { path: getRoutePath('admin_transactions'), element: <TransactionsPage /> },
  { path: getRoutePath('admin_fees'), element: <FeesPage /> },
]
