import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'
import { FaXTwitter, FaYoutube } from 'react-icons/fa6'
import { IoLogoInstagram } from 'react-icons/io5'
import { Link } from 'react-router-dom'

/**
 * The redesigned creators website footer: the AFROREVIVE wordmark across the
 * page, then socials, links and the copyright. Light under the pages that end
 * on white (home, contact); dark where the page stays black (about).
 */
export default function CreatorsFooter({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const isDark = tone === 'dark'

  return (
    // The band above the rule is part of the design, on both tones.
    <footer
      className={cn(
        'relative z-20 w-full pt-16 md:pt-[120px]',
        isDark ? 'bg-black text-[#5C5C5C]' : 'bg-white text-[#1E1E1E]',
      )}>
      <div
        className={cn(
          // The wordmark's own line box adds space around it, hence the
          // smaller padding and gap than the design's measurements.
          'w-full flex flex-col items-center gap-8 md:gap-10 overflow-hidden border-t px-4 pt-10 pb-8 md:pt-[60px] md:pb-16',
          isDark ? 'border-white/10' : 'border-medium-gray',
        )}>
        {/* Decorative: sized to the viewport so it spans ~94% of the page at any width. */}
        <p
          aria-hidden
          className={cn(
            'w-full text-center whitespace-nowrap font-work-sans font-black uppercase leading-none text-[14.5vw]',
            isDark ? 'text-[#1C1C1C]' : 'text-[#1E1E1E]',
          )}>
          Afrorevive
        </p>

        <div className='flex flex-col items-center gap-3'>
          <div className='flex items-center gap-3'>
            {SOCIALS.map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target='_blank'
                rel='noopener noreferrer'
                aria-label={label}
                className='transition-opacity hover:opacity-70'>
                <Icon className='size-6 md:size-8' />
              </a>
            ))}
          </div>

          <nav className='flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-inter-tight text-[11px] md:text-[13px]'>
            {LINKS.map((link) => (
              <Link key={link.name} to={link.href} className='hover:underline'>
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex flex-col items-center gap-0.5 font-inter-tight text-[8px] md:mt-6 md:text-[9px]'>
          <p>© All Rights Reserved</p>
          <p className='uppercase'>Afrorevive Events Limited @ 2025</p>
        </div>
      </div>
    </footer>
  )
}

const SOCIALS = [
  {
    href: 'https://www.instagram.com/afrorevive_?igsh=ZThudm8zODkyZTJv&utm_source=qr',
    Icon: IoLogoInstagram,
    label: 'Instagram',
  },
  { href: 'https://x.com/afrorevive?s=21', Icon: FaXTwitter, label: 'X' },
  // The same placeholder the other footers use until there's a channel to link.
  { href: '/', Icon: FaYoutube, label: 'YouTube' },
]

const LINKS = [
  { href: getRoutePath('terms_and_conditions'), name: 'Terms & Conditions' },
  { href: getRoutePath('home'), name: 'Discover events' },
  { href: getRoutePath('support'), name: 'Support' },
  { href: getRoutePath('creators_blog'), name: 'Blog' },
  { href: getRoutePath('work_with_us'), name: 'Work with us' },
]
