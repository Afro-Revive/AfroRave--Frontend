import { getRoutePath } from '@/config/get-route-path'
import { FooterLinks } from '@/layouts/components/footer-links'
import { FooterLinkBlock, type IFooterLinks } from '@/layouts/components/footer-links-block'
import { Socials } from '@/layouts/components/socials'

export default function Footer() {
  return (
    <footer className='relative w-full flex flex-col font-input-mono z-20' style={{ background: 'transparent' }}>

      {/* Newsletter Container — border-top 1px, gap 24px, ~165px */}
      <div className='w-full flex flex-col gap-[24px] border-t border-white/20 px-[60px] py-[24px]'>
        <FooterLinks className='md:h-5' />
        <div className='w-full flex gap-[120px] justify-start'>
          {footer_links.map((footer_link) => (
            <FooterLinkBlock key={footer_link.title} {...footer_link} />
          ))}
        </div>
      </div>

      {/* Footer Bottom Container */}
      <div className='w-full flex flex-row items-center px-[60px] py-[16px] border-t border-white/20'>
        <Socials isCreator />
      </div>

    </footer>
  )
}

const footer_links: IFooterLinks[] = [
  {
    title: 'Helpful Links',
    links: [
      { href: getRoutePath('home'), name: 'Discover events' },
      { href: getRoutePath('help_center'), name: 'Support' },
    ],
  },
  {
    title: 'Company',
    links: [
      { href: getRoutePath('creators_blog'), name: 'Blog' },
      { href: getRoutePath('work_with_us'), name: 'Work With Us' },
    ],
  },
]
