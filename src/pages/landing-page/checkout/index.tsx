import CheckoutSummary from './sections/checkout-summary'
import { UserLoginForm } from '@/pages/auth/user-login/user-login-form'
import { useAfroStore } from '@/stores'
import { cn } from '@/lib/utils'
import { DialogClose } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { EventDetailData } from '@/types'

export default function CheckoutPage({
  event,
  event_id,
}: {
  event: EventDetailData
  event_id?: string
}) {
  const { isAuthenticated, isFan } = useAfroStore()

  const isFanAccount = isAuthenticated && isFan

  return (
    <section className="relative w-full min-h-screen flex flex-col md:flex-row">
      <DialogClose className="absolute top-4 right-4 bg-transparent shadow-none z-[1001] p-1">
        <X size={18} color="white" strokeWidth={3} />
      </DialogClose>

      <div
        className={cn(
          'h-screen overflow-y-auto md:h-auto md:overflow-y-visible md:min-h-full flex items-start md:items-center justify-start md:justify-center pt-16 md:pt-0 px-10 md:px-14 bg-[#1E1E1E]',
          {
            'w-full': isFanAccount,
            'hidden md:flex md:w-1/2': !isFanAccount,
          },
        )}>
        <CheckoutSummary event={event} isFanAccount={isFanAccount} eventId={event_id} />
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

        </div>
      )}
    </section>
  )
}
