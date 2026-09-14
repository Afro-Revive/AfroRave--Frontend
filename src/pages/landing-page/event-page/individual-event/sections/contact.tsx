import { SectionContainer } from '../_components/section-container'
import { BlockName } from '../../_components/block-name'
import { Link } from 'react-router-dom'
import type { EventDetailData } from '@/types'
import {
  getEventSocialLinks,
  type EventSocials,
  type EventSocialPlatform,
} from '@/lib/helper-func'

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

// No Facebook asset ships yet, so it falls back to the YouTube mark.
const SOCIAL_ICON_NAMES: Record<EventSocialPlatform, string> = {
  instagram: 'insta',
  x: 'X',
  tiktok: 'tiktok',
  facebook: 'yt',
}

function SocialMediaLinks({ socials }: { socials: Partial<EventSocials> }) {
  const links = getEventSocialLinks(socials)

  return (
    <div className='flex items-center gap-5'>
      {links.map(({ platform, alt, url }) => (
        <Link key={platform} to={url} target='_blank' rel='noopener noreferrer'>
          <img
            src={`/assets/landing-page/${SOCIAL_ICON_NAMES[platform]}.png`}
            alt={alt}
            className='w-[18px] h-auto'
          />
        </Link>
      ))}
    </div>
  )
}
