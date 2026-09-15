import { SectionContainer } from '../_components/section-container'
import { BlockName } from '../../_components/block-name'
import { Link } from 'react-router-dom'
import type { EventDetailData } from '@/types'
import {
  getEventSocialLinks,
  type EventSocials,
  type EventSocialPlatform,
} from '@/lib/helper-func'
import { IoLogoInstagram } from 'react-icons/io5'
import { FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6'
import type { IconType } from 'react-icons'

export default function ContactSection({ event }: { event: EventDetailData }) {
  return (
    <SectionContainer>
      <BlockName name='contact' />

      <div className='w-full flex flex-col'>
        <div className='w-full flex items-center justify-between p-6 border-b border-mid-dark-gray/30 rounded-t-[8px] bg-[#3d3d3d]'>
          <p className='text-xl font-medium leading-[140%] font-sf-pro-display'>Socials</p>

          <SocialMediaLinks socials={event.eventDetails.socials} />
        </div>

        {event.eventDetails.eventContact.website && (
          <div className='w-full flex items-center justify-between p-6 border-b border-mid-dark-gray/30 rounded-b-[8px] bg-[#3d3d3d]'>
            <p className='text-xl font-medium leading-[140%] font-sf-pro-display'>Website</p>

            <Link
              to={event.eventDetails.eventContact.website}
              className='font-sf-pro-display font-medium text-xl w-fit leading-[140%] underline text-[#419e57] underline-offset-4'>
              Click here
            </Link>
          </div>
        )}
      </div>
    </SectionContainer>
  )
}

const SOCIAL_ICONS: Record<EventSocialPlatform, IconType> = {
  instagram: IoLogoInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
}

function SocialMediaLinks({ socials }: { socials: Partial<EventSocials> }) {
  const links = getEventSocialLinks(socials)

  return (
    <div className='flex items-center gap-5'>
      {links.map(({ platform, alt, url }) => {
        const Icon = SOCIAL_ICONS[platform]

        return (
          <Link
            key={platform}
            to={url}
            target='_blank'
            rel='noopener noreferrer'
            aria-label={alt}
            className='text-white hover:opacity-80 transition-opacity'>
            <Icon className='w-[18px] h-[18px]' />
          </Link>
        )
      })}
    </div>
  )
}
