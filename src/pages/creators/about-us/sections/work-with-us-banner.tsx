import { getRoutePath } from '@/config/get-route-path'
import { Link } from 'react-router-dom'

/** "Work with us": partners, collaborators and organizers, pointed at Contact Us. */
export default function WorkWithUsBanner() {
  return (
    <section className='w-full text-white'>
      <div className='w-full max-w-[1280px] mx-auto flex flex-col items-center px-6 pt-24 md:px-[60px] md:pt-[140px]'>
        <h2 className='text-center font-work-sans font-black uppercase text-[36px] leading-none md:text-[48px]'>
          Work with us
        </h2>

        <p className='mt-5 max-w-[780px] text-center font-work-sans text-base leading-snug md:text-lg'>
          We’re at the beginning of something significant and we’re looking for partners,
          collaborators who share the vision. Whether you’re a brand, a developer, or an organizer
          ready to be part of the early journey, we want to hear from you.
        </p>

        <Link
          to={getRoutePath('creators_contact')}
          className='mt-6 rounded-md border border-white px-5 py-2.5 font-inter-tight text-xs font-semibold transition-colors hover:bg-white hover:text-black'>
          Contact Us
        </Link>
      </div>
    </section>
  )
}
