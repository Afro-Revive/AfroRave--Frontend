import { cn } from '@/lib/utils'
import { Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";
import { FaYoutube } from "react-icons/fa6";

export function Socials({
  className,
  data = socials,
  showLanguage = false,
}: {
  className?: string
  data?: ISocials[]
  isCreator?: boolean
  showLanguage?: boolean
}) {
  return (
    <div className={cn('w-full flex items-center justify-between', className)}>
      <div className='flex items-center gap-3'>
        {data.map((item) => (
          <Link key={item.alt} to={item.href} target='_blank' rel='noopener noreferrer' className='cursor-pointer hover:opacity-80'>
            {item.icon}
          </Link>
        ))}
      </div>

      {showLanguage && (
        <div className='flex items-center gap-1.5 text-white/70 hover:text-white transition-colors cursor-pointer'>
          <Globe size={15} strokeWidth={1.5} />
          <span className='text-xs font-sf-pro-text tracking-wide'>English</span>
        </div>
      )}
    </div>
  )
}

const socials: ISocials[] = [
  { href: 'https://www.instagram.com/afrorevive_?igsh=ZThudm8zODkyZTJv&utm_source=qr', icon: <IoLogoInstagram className='md:w-10 md:h-10 w-7 h-7' />, alt: 'Instagram' },
  { href: 'https://x.com/afrorevive?s=21', icon: <FaXTwitter className='md:w-10 md:h-10 w-7 h-7' />, alt: 'X' },
  { href: '/', icon: <FaYoutube className='md:w-10 md:h-10 w-7 h-7' />, alt: 'Youtube' },
]

export interface ISocials {
  href: string
  icon: React.ReactNode
  alt: string
}
