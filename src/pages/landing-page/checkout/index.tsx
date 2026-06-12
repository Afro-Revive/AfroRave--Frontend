import CartSummary from './sections/cart-summary'
import { UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { useAfroStore } from '@/stores'
import { cn } from '@/lib/utils'
import { DialogClose } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { useEffect, useState } from 'react'

function useCountdown(seconds: number) {
  const [remaining, setRemaining] = useState(seconds)

  useEffect(() => {
    if (remaining <= 0) return
    const id = setInterval(() => setRemaining((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [remaining])

  const m = String(Math.floor(remaining / 60)).padStart(2, '0')
  const s = String(remaining % 60).padStart(2, '0')
  return { display: `${m}:${s}`, expired: remaining <= 0 }
}

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
  const { display, expired } = useCountdown(10 * 60)

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row">
      <DialogClose className="absolute top-4 right-4 bg-transparent shadow-none z-[1001] p-1">
        <X size={18} color="#000000" strokeWidth={3} />
      </DialogClose>

      <div
        className={cn(
          'min-h-full flex items-start md:items-center justify-start md:justify-center pt-30 md:pt-0 px-10 md:px-14 bg-gradient-to-b from-soft-gray via-cool-gray to-deep-gray backdrop-blur-[3px]',
          {
            'w-full': isFanAccount,
            'hidden md:flex md:w-1/2': !isFanAccount,
          },
        )}>
        <CartSummary name={event_name} location={event_location} isFanAccount={isFanAccount} eventId={event_id} />
      </div>

      {!isFanAccount && (
        <div className="w-full md:w-1/2 min-h-screen md:min-h-full z-30 flex flex-col py-32 gap-10 px-8 bg-[#ECEBEB]">
          <div className="flex flex-col items-center mb-10">
            <p className="font-sf-pro-display leading-[100%] text-black">
              Log in or Sign up to access and manage your order.
            </p>
            <p className="font-sf-pro-display leading-[100%] text-black">
              {"Don't worry - it's quick and easy!"}
            </p>
          </div>

          <UserLoginForm onLoginSuccess={() => {}} />

          <p className="text-xs text-center font-input-mono text-deep-red">
            {expired
              ? 'Your session has expired'
              : `Please checkout within ${display} minutes`}
          </p>
        </div>
      )}
    </section>
  )
}
