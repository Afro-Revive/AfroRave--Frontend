import type { EventDetailData } from '@/types'
import {
  getEventSocialLinks,
  toAbsoluteUrl,
  type EventSocials,
  type EventSocialPlatform,
} from '@/lib/helper-func'
import { IoLogoInstagram } from 'react-icons/io5'
import { FaXTwitter, FaTiktok, FaFacebookF } from 'react-icons/fa6'
import { Mail, Link2 } from 'lucide-react'
import type { IconType } from 'react-icons'

const SOCIAL_ICONS: Record<EventSocialPlatform, IconType> = {
  instagram: IoLogoInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
  facebook: FaFacebookF,
}

export default function ContactSection({
  event,
  title = 'Contact event organizers',
}: {
  event: EventDetailData
  /** The organizer's own preview (Publish) calls it 'Contact details'. */
  title?: string
}) {
  const { socials, eventContact } = event.eventDetails

  const email = eventContact?.email?.trim()
  const website = eventContact?.website?.trim()

  return (
    <div className='w-full rounded-2xl bg-gunmetal-gray px-6 py-5 flex flex-col gap-4'>
      <p className='font-inter-tight text-base md:text-lg font-bold text-white'>
        {title}
      </p>

      <div className='flex items-center gap-5'>
        <SocialMediaLinks socials={socials} />

        {email && (
          <ContactIconLink href={`mailto:${email}`} label={`Email ${email}`}>
            <Mail className='w-7 h-7' />
          </ContactIconLink>
        )}

        {website && (
          <ContactIconLink
            href={toAbsoluteUrl(website, 'https://')}
            label='Visit website'
            external>
            <Link2 className='w-7 h-7' />
          </ContactIconLink>
        )}
      </div>
    </div>
  )
}

function SocialMediaLinks({ socials }: { socials: Partial<EventSocials> }) {
  // Only the platforms the organizer actually filled in.
  const links = getEventSocialLinks(socials)

  return (
    <>
      {links.map(({ platform, alt, url }) => {
        const Icon = SOCIAL_ICONS[platform]

        return (
          <ContactIconLink key={platform} href={url} label={alt} external>
            <Icon className='w-7 h-7' />
          </ContactIconLink>
        )
      })}
    </>
  )
}

function ContactIconLink({
  href,
  label,
  external = false,
  children,
}: {
  href: string
  label: string
  /** mailto: links shouldn't open a blank tab. */
  external?: boolean
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      aria-label={label}
      title={label}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className='text-white transition-opacity hover:opacity-80'>
      {children}
    </a>
  )
}
