import CartSummary from './sections/cart-summary'
import { UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { useAfroStore } from '@/stores'
import { cn } from '@/lib/utils'

export default function CheckoutPage({
  event_name,
  event_location,
}: {
  event_name: string
  event_location: string
}) {
  const { isAuthenticated, isFan, user} = useAfroStore()
  console.log(isAuthenticated, isFan, user)

  const isFanAccount = isAuthenticated && isFan

  return (
    <section className='w-full min-h-screen flex'>
      <div
        className={cn(
          'min-h-full flex items-center justify-end px-14 bg-gradient-to-b from-soft-gray via-cool-gray to-deep-gray backdrop-blur-[3px]',
          {
            'w-full': isFanAccount,
            'w-1/2': !isFanAccount,
          },
        )}>
        <CartSummary name={event_name} location={event_location} isFanAccount={isFanAccount} />
      </div>

      {!isFanAccount && (
        <div className='w-1/2 min-h-full z-30 flex flex-col py-14 px-8 bg-[#ECEBEB]'>
          <div className='flex flex-col items-center'>
            <p className='font-sf-pro-display leading-[100%] text-black'>
              Log in or Sign up to access and manage your order.
            </p>
            <p className='font-sf-pro-display leadinf-[100%] text-black'>
              Don’t worry- it’s quick and easy!
            </p>
          </div>

          <div className='h-full py-[100px] flex flex-col items-center gap-10'>
            <UserLoginForm />
            <p className='text-xs font-input-mono text-deep-red'>
              Please checkout within 10:00 minutes
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
