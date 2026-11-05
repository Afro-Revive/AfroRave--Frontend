
import { account_links } from '@/components/constants'
import { cn } from '@/lib/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

interface MobileSidebarProps {
    isOpen: boolean
    onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
    const location = useLocation()

    const isLinkActive = (itemLink: string) => {
        if (itemLink.includes('?')) {
            const linkQuery = itemLink.split('?')[1]
            return location.search.includes(linkQuery)
        }

        if (location.pathname === itemLink) {
            if (itemLink.endsWith('/account') && location.search.includes('account=wallet')) {
                return false
            }
            return true
        }

        return false
    }

    // Red filter for icons
    const redFilter =
        'brightness(0) saturate(100%) invert(19%) sepia(98%) saturate(6947%) hue-rotate(356deg) brightness(91%) contrast(113%)'

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='fixed inset-0 bg-black/80 z-[60] backdrop-blur-sm'
                    />

                    {/* Sidebar */}
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className='fixed top-0 left-0 w-full h-full bg-[#1A1A1A] z-[70] flex flex-col p-6'>

                        {/* Header */}
                        <div className='flex items-center justify-between mb-8'>
                            <button onClick={onClose} className='text-white p-2'>
                                <ChevronLeft className='w-6 h-6' />
                            </button>
                            <button onClick={onClose} className='text-white p-2'>
                                <X className='w-6 h-6' />
                            </button>
                        </div>

                        {/* Links */}
                        <div className='flex flex-col gap-6 mt-4'>
                            {account_links.map((item) => {
                                const active = isLinkActive(item.link)
                                // Aliased so TS narrows the union — it won't narrow `item.icon` in JSX.
                                const Icon = item.icon

                                return (
                                    <div key={item.name} className='flex flex-col'>
                                        <Link
                                            to={item.link}
                                            onClick={onClose}
                                            className={cn(
                                                'flex items-center gap-4 py-3 group font-input-mono transition-colors',
                                                active ? 'text-deep-red' : 'text-white/60 hover:text-white'
                                            )}>
                                            {typeof Icon === 'string' ? (
                                                <img
                                                    src={Icon}
                                                    alt={item.name}
                                                    className='w-5 h-5 transition-all'
                                                    style={{
                                                        filter: active ? redFilter : 'brightness(0) invert(1) opacity(0.6)',
                                                    }}
                                                />
                                            ) : (
                                                // Inherits the Link's active/inactive colour via currentColor.
                                                <Icon className='w-5 h-5 transition-colors' />
                                            )}
                                            <span className='text-sm uppercase tracking-[0.05em] font-medium'>
                                                {item.name}
                                            </span>
                                        </Link>
                                        <div className={cn("h-[1px] w-full bg-white/10 mt-2", active ? "bg-deep-red/20" : "")} />
                                    </div>
                                )
                            })}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
