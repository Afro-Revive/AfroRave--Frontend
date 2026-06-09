import CartSummary from './sections/cart-summary'
import { UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { useAfroStore } from '@/stores'
import { cn } from '@/lib/utils'
import { DialogClose } from '@/components/ui/dialog'
import { X } from 'lucide-react'

export default function CheckoutPage({
  event_name,
  event_location,
  event_id,
}: {
  event_name: string
  event_location: string
  event_id?: string
}) {
  const { isAuthenticated, isFan } = useAfroStore()

  const isFanAccount = isAuthenticated && isFan

  return (
    <section className='relative w-full min-h-screen flex'>
      <DialogClose className='absolute top-4 right-4 bg-transparent shadow-none z-[1001] p-1'>
        <X size={18} color='#000000' strokeWidth={3} />
      </DialogClose>
      <div
        className={cn(
          'min-h-full flex items-center justify-end px-14 bg-gradient-to-b from-soft-gray via-cool-gray to-deep-gray backdrop-blur-[3px]',
          {
            'w-full': isFanAccount,
            'w-1/2': !isFanAccount,
          },
        )}>
        <CartSummary name={event_name} location={event_location} isFanAccount={isFanAccount} eventId={event_id} />
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
            <UserLoginForm onLoginSuccess={() => {}} />
            <p className='text-xs font-input-mono text-deep-red'>
              Please checkout within 10:00 minutes
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
