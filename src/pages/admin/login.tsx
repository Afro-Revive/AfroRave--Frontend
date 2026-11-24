import { getRoutePath } from '@/config/get-route-path'
import { useAdminLogin } from '@/hooks/use-admin'
import { useAfroStore } from '@/stores'
import { useState } from 'react'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { Navigate } from 'react-router-dom'
import { AdminHead } from './components/admin-head'

/** /admin/login: its own page, outside the fan and creator sites' login modal. */
export default function AdminLoginPage() {
  const user = useAfroStore((state) => state.user)
  const login = useAdminLogin()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  if (user?.accountType === 'Admin') return <Navigate to={getRoutePath('admin_dashboard')} replace />

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4 font-inter-tight text-white'>
      <AdminHead />
      <form
        onSubmit={(event) => {
          event.preventDefault()
          login.mutate({ email: email.trim(), password })
        }}
        className='flex w-full max-w-sm flex-col gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-6'>
        <div className='flex flex-col items-center gap-3 text-center'>
          <div className='flex items-center gap-2'>
            <img src='/assets/landing-page/AR.png' alt='Afrorevive' width={64} height={20} className='h-6 w-auto' />
            <span className='rounded bg-deep-red px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider'>
              Admin
            </span>
          </div>
          <h1 className='text-xl font-bold'>Sign in to the admin portal</h1>
        </div>

        {user && (
          <p className='rounded-lg bg-amber-500/10 p-3 text-xs text-amber-200'>
            You&rsquo;re signed in as {user.email}, which isn&rsquo;t an admin account. Signing in here
            replaces that session.
          </p>
        )}

        <label className='flex flex-col gap-1.5 text-sm'>
          Email
          <input
            type='email'
            required
            autoComplete='username'
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className='h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-white focus:border-white/30 focus:outline-none'
          />
        </label>

        <label className='flex flex-col gap-1.5 text-sm'>
          Password
          <span className='relative flex items-center'>
            <input
              type={showPassword ? 'text' : 'password'}
              required
              autoComplete='current-password'
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className='h-10 w-full rounded-lg border border-white/10 bg-white/5 pl-3 pr-10 text-white focus:border-white/30 focus:outline-none'
            />
            <button
              type='button'
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-2 rounded p-1 text-white/60 hover:text-white'>
              {showPassword ? <RiEyeOffLine className='size-4' /> : <RiEyeLine className='size-4' />}
            </button>
          </span>
        </label>

        <button
          type='submit'
          disabled={login.isPending}
          className='h-10 rounded-lg bg-white text-sm font-semibold text-system-black hover:bg-white/90 disabled:opacity-60'>
          {login.isPending ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
