import { getRoutePath } from '@/config/get-route-path'
import CreatorsFooter from '@/layouts/creators-landing-page-layout/sections/creators-footer'
import { Link, Outlet } from 'react-router-dom'

/**
 * The Support and Terms pages, which fans and creators share: a plain dark bar with
 * the logo and Contact us, a white page, and the creators footer.
 */
export default function HelpLayout() {
  return (
    <div className='flex min-h-svh flex-col bg-white'>
      <header className='sticky top-0 z-40 w-full bg-charcoal'>
        <div className='flex h-16 items-center justify-between px-5 md:px-16'>
          <Link to={getRoutePath('home')}>
            <img src='/assets/landing-page/AR.png' alt='Afrorevive' className='h-7 w-[70px] object-contain' />
          </Link>

          <Link
            to={getRoutePath('creators_contact')}
            className='font-work-sans text-sm uppercase tracking-wide text-white transition-opacity hover:opacity-80'>
            Contact us
          </Link>
        </div>
      </header>

      <Outlet />

      <CreatorsFooter />
    </div>
  )
}
