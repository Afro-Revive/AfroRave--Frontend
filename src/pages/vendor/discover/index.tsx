import { CalendarIcon } from '@/components/icons/calendar'
import { DashboardCardSkeleton, DashboardCards } from '@/components/shared/dashboard-cards'
import { getRoutePath } from '@/config/get-route-path'
import { useGetVendorAvailableEvents } from '@/hooks/use-event-mutations'
import { AddFilterBUtton } from '@/pages/creators/standalone/components/add-filter-btn'
import { Bookmark } from 'lucide-react'
import { Link } from 'react-router-dom'
import WishListBtn from '../component/wishlist-button'
import { useAfroStore } from '@/stores'

const SKELETON_IDS = ['1', '2', '3', '4', '5', '6']

function useProfileCompletion() {
  const { user } = useAfroStore()
  if (!user) return 0
  let score = 0
  if (user.profile.firstName) score++
  if (user.businessName || user.companyName) score++
  if (user.telphone) score++
  if (user.email) score++
  if (user.gender) score++
  if (user.portfolio) score++
  const hasSocials = user.socialLinks && Object.values(user.socialLinks).some(link => !!link)
  if (hasSocials) score++
  if (user.description) score++
  if (user.profilePicture) score++
  if (user.gallery && user.gallery.length > 0) score++
  return (score / 10) * 100
}

export default function VendorDiscoverPage() {
  const completionPercentage = useProfileCompletion()
  const { data: response, isPending: isLoading } = useGetVendorAvailableEvents()
  console.log(response)

  const events = response?.data

  if (isLoading) {
    return (
      <section className='w-full h-full flex flex-col justify-start items-start px-[1px]'>
        <div className='w-full h-14 flex items-center justify-between px-8 bg-white'>
          <AddFilterBUtton />
          <WishListBtn />
        </div>
        <div className='flex flex-wrap gap-7 px-5 md:px-[60px] lg:px-[120px] py-6 md:py-12 lg:py-24'>
          {SKELETON_IDS.map((id) => (
            <DashboardCardSkeleton key={id} />
          ))}
        </div>
      </section>
    )
  }

  if (completionPercentage < 100) {
    return (
      <section className='w-full h-full flex flex-col justify-start items-start px-[1px]'>
        <div className='w-full h-14 flex items-center justify-between px-4 md:px-8 bg-white'>
          <AddFilterBUtton />
          <WishListBtn />
        </div>
        <div className='w-full h-[70vh] flex flex-col items-center justify-center gap-4 px-4 text-center'>
          <p className='text-xl md:text-2xl font-bold font-sf-pro-display text-black'>Complete your profile to discover events</p>
          <p className='text-sm text-gray-400 max-w-sm font-sf-pro-text'>You need a complete profile before you can browse and apply for event slots.</p>
          <Link
            to={getRoutePath('vendor_profile')}
            className='mt-2 h-9 px-6 rounded-[6px] bg-deep-red text-white text-xs font-sf-pro-text font-semibold flex items-center justify-center hover:bg-deep-red/90 transition-colors'
          >
            Complete Profile
          </Link>
        </div>
      </section>
    )
  }

  return (
    <section className='w-full h-full flex flex-col justify-start items-start px-[1px]'>
      <div className="w-full h-14 flex items-center justify-between px-4 md:px-8 bg-white">
        <AddFilterBUtton />
        <WishListBtn />
      </div>

      <div className="w-full px-4 md:px-8 lg:px-16 py-6 md:py-8">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold font-sf-pro-display text-black mb-6 md:mb-8">
          Discover events near you!
        </h2>

        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {events.map((event) => {
              const availableSlots = (event.totalTicket || 0) - (event.ticketSold || 0)
              const isEnded = new Date(event.endDate) < new Date()

              return (
                <DiscoverCard
                  key={event.eventId}
                  eventId={event.eventId}
                  image={event.metadata.desktopMedia.flyer}
                  name={event.eventName}
                  startDate={event.startDate}
                  availableSlots={availableSlots > 0 ? availableSlots : 0}
                  status={isEnded ? 'ended' : undefined}
                />
              )
            })}
          </div>
        ) : (
          <div className="w-full h-[60vh] flex flex-col items-center justify-center">
            <div className="w-fit flex items-center gap-2 stroke-medium-gray text-medium-gray">
              <CalendarIcon stroke="inherit" className="size-6 md:size-8" />
              <p className="text-lg md:text-2xl font-bold font-sf-pro-display uppercase">no available events</p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function DiscoverCard({ eventId, image, name, startDate, availableSlots, status }: IDiscoverCardProps) {
  return (
    <Link to={getRoutePath('vendor_event_details', { eventId })}>
      <DashboardCards
        image={image}
        name={name}
        startDate={startDate}
        status={status}
        cardButtons={[
          { Icon: Bookmark, alt: 'Bookmark' },
          { src: '/assets/dashboard/creator/ellipses.png', alt: 'Ellipses' },
        ]}
        cardInfo={[
          <p key="available_slots" className="font-sf-pro-rounded text-xs text-mid-dark-gray">
            Available Slots: <span className="text-[#34C759] font-medium">{availableSlots}</span>
          </p>,
        ]}
        className="w-full"
      />
    </Link>
  )
}

interface IDiscoverCardProps {
  eventId: string
  image: string
  name: string
  startDate: string
  availableSlots: number
  status?: 'ended' | 'drafts'
}
