import { LoadingFallback } from '@/components/loading-fallback'
import { AdminHead } from '@/pages/admin/components/admin-head'
import { getRoutePath } from '@/config/get-route-path'
import { useLogout } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'
import { useAfroStore } from '@/stores'
import { Suspense } from 'react'
import type { IconType } from 'react-icons'
import {
  RiCalendarEventLine,
  RiDashboardLine,
  RiExchangeDollarLine,
  RiGroupLine,
  RiLogoutBoxRLine,
  RiPercentLine,
  RiShieldUserLine,
  RiTicket2Line,
} from 'react-icons/ri'
import { Navigate, NavLink, Outlet, useLocation } from 'react-router-dom'

const NAV: { to: string; label: string; icon: IconType; end?: boolean }[] = [
  { to: getRoutePath('admin_dashboard'), label: 'Dashboard', icon: RiDashboardLine, end: true },
  { to: getRoutePath('admin_users'), label: 'Users', icon: RiGroupLine },
  { to: getRoutePath('admin_events'), label: 'Events', icon: RiCalendarEventLine },
  { to: getRoutePath('admin_orders'), label: 'Orders', icon: RiTicket2Line },
  { to: getRoutePath('admin_transactions'), label: 'Transactions', icon: RiExchangeDollarLine },
  { to: getRoutePath('admin_fees'), label: 'Fees', icon: RiPercentLine },
]

/**
 * The admin portal's frame: a sidebar (a scrolling tab row on phones) and the
 * page. Only Admin accounts get in; anyone signed out goes to /admin/login.
 */
export default function AdminLayout() {
  const location = useLocation()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const user = useAfroStore((state) => state.user)

  if (!isAuthenticated || !user) {
    return <Navigate to={getRoutePath('admin_login')} replace state={{ from: location.pathname }} />
  }

  if (user.accountType !== 'Admin') return <NotAnAdmin email={user.email} />

  return (
    <div className='min-h-screen bg-[#0d0d0d] font-inter-tight text-white md:flex'>
      <AdminHead />
      <Sidebar email={user.email} />

      <main className='min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8'>
        <div className='mx-auto flex max-w-7xl flex-col gap-6'>
          <Suspense fallback={<LoadingFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  )
}

function Brand() {
  return (
    <div className='flex items-center gap-2'>
      <img src='/assets/landing-page/AR.png' alt='Afrorevive' width={64} height={20} className='h-5 w-auto' />
      <span className='rounded bg-deep-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider'>
        Admin
      </span>
    </div>
  )
}

function Sidebar({ email }: { email: string }) {
  const logout = useLogout()

  return (
    <aside className='sticky top-0 z-20 flex flex-col border-b border-white/10 bg-system-black md:h-screen md:w-60 md:shrink-0 md:border-b-0 md:border-r'>
      <div className='flex items-center justify-between px-4 py-4 md:px-5 md:py-6'>
        <Brand />
        <button
          type='button'
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          aria-label='Log out'
          className='rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white md:hidden'>
          <RiLogoutBoxRLine className='size-5' aria-hidden />
        </button>
      </div>

      <nav aria-label='Admin' className='flex gap-1 overflow-x-auto px-2 pb-2 md:flex-1 md:flex-col md:px-3 md:pb-0'>
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex shrink-0 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5 hover:text-white',
              )
            }>
            <Icon className='size-[18px]' aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className='hidden flex-col gap-3 border-t border-white/10 p-4 md:flex'>
        <div className='flex items-center gap-2 text-xs text-white/60'>
          <RiShieldUserLine className='size-4 shrink-0' aria-hidden />
          <span className='truncate' title={email}>
            {email}
          </span>
        </div>
        <button
          type='button'
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className='flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-white/70 hover:bg-white/5 hover:text-white disabled:opacity-50'>
          <RiLogoutBoxRLine className='size-[18px]' aria-hidden />
          {logout.isPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </aside>
  )
}

/** Signed in, but not as an admin. */
function NotAnAdmin({ email }: { email: string }) {
  const logout = useLogout({ stayOnPage: true })

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4 font-inter-tight text-white'>
      <AdminHead />
      <div className='flex w-full max-w-sm flex-col items-center gap-4 text-center'>
        <Brand />
        <h1 className='text-xl font-bold'>This area is for admin accounts</h1>
        <p className='text-sm text-white/60'>
          You&rsquo;re signed in as <span className='break-all text-white'>{email}</span>. Log out, then
          sign in with an admin account.
        </p>
        <button
          type='button'
          onClick={() => logout.mutate()}
          disabled={logout.isPending}
          className='h-10 w-full rounded-lg bg-white text-sm font-semibold text-system-black hover:bg-white/90 disabled:opacity-60'>
          {logout.isPending ? 'Logging out…' : 'Log out'}
        </button>
      </div>
    </div>
  )
}
