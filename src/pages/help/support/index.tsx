import { RiVerifiedBadgeFill } from 'react-icons/ri'
import { InfoPage } from '../_components/info-page'
import { SUPPORT_SECTIONS } from './content'

export default function SupportPage() {
  return (
    <InfoPage
      eyebrow='Afrorevive support'
      title='User support'
      sections={SUPPORT_SECTIONS}
      searchable
      intro={
        <>
          <p className='max-w-[700px] text-lg leading-snug md:text-xl'>
            Whether you’re attending an event or hosting one, you’ll find the guidance you need to get the most out of Afrorevive.
          </p>
          <ProductionCallout />
        </>
      }
    />
  )
}

function ProductionCallout() {
  return (
    <aside className='flex flex-col gap-1.5 rounded-md bg-[#464444] px-4 py-3 text-white'>
      <h2 className='flex items-center gap-2 text-lg font-semibold'>
        <RiVerifiedBadgeFill aria-hidden className='size-5 shrink-0' />
        Need production for your event?
      </h2>

      <div className='flex flex-col gap-1 pl-7 text-[15px] leading-relaxed md:text-base'>
        <p>
          Through our affiliate, <strong className='font-semibold'>Cytech World Communications & Afrorevive VFX</strong> offers on-site
          production support for your event, including:
        </p>
        <ul className='list-disc pl-5'>
          <li>Screens</li>
          <li>Sound</li>
          <li>Lighting</li>
          <li>Staging</li>
        </ul>
        <p>
          On-site asset support is currently only available within Africa. To request equipment for your event, please send a
          request through the Contact Us section on the Creators page. Our team would love to hear about your event and will work
          with you to find the right production setup for it.
        </p>
      </div>
    </aside>
  )
}
