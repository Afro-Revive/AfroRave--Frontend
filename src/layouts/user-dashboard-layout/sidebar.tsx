import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, Zap, Settings } from 'lucide-react'
import { MdOutlineContactSupport } from 'react-icons/md'
import { getRoutePath } from '@/config/get-route-path'
import { cn } from '@/lib/utils'

const link_class =
    'flex w-full items-center gap-4 py-5 lg:pl-15 pl-6 text-left text-white/40 transition-colors duration-200 hover:text-white/80'

const label_class = 'font-input-mono text-base font-medium tracking-[0.08em] uppercase'

// Indented to clear the icon so the rule starts under the label.
const divider_class = 'h-px lg:w-full w-3/4 lg:ml-15 ml-6 bg-white/10'

export default function AccountSidebar() {
    const navigate = useNavigate()
    const location = useLocation()

    const isProfileActive = () => {
        return location.pathname === '/fans/account' && !location.search.includes('account=wallet')
    }

    return (
        <aside className='hidden md:flex fixed left-0 top-0 z-40 h-screen w-70 flex-col lg:pl-10 pl-6 pr-5 pt-40 pb-8 pointer-events-none'>
            <div className='pointer-events-auto flex w-full flex-col'>
                {/* Back Button */}
                <div className='pl-0 mb-12'>
                    <button
                        onClick={() => navigate(-1)}
                        className='flex items-center justify-center w-8 h-8 text-white hover:text-white/80 transition-colors'
                        aria-label='Go back'
                    >
                        <ChevronLeft className='w-6 h-6' strokeWidth={2} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className='flex flex-col gap-0'>
                    {/* PROFILE */}
                    <div className='mb-4'>
                        <button
                            onClick={() => navigate('/fans/account')}
                            className={cn(link_class, isProfileActive() && 'text-white')}
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                <Zap className='w-5 h-5' strokeWidth={1.5} />
                            </div>
                            <span className={label_class}>PROFILE</span>
                        </button>
                        <div className={divider_class} />
                    </div>

                    {/* SETTINGS */}
                    <div className='mb-4'>
                        <button
                            onClick={() => navigate('/fans/settings')}
                            className={cn(
                                link_class,
                                location.pathname === '/fans/settings' && 'text-white',
                            )}
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                <Settings className='w-5 h-5' strokeWidth={1.5} />
                            </div>
                            <span className={label_class}>SETTINGS</span>
                        </button>
                        <div className={divider_class} />
                    </div>

                    {/* SUPPORT */}
                    <div className='mb-4'>
                        <button
                            onClick={() => navigate(getRoutePath('support'))}
                            className={cn(
                                link_class,
                                location.pathname === getRoutePath('support') && 'text-white',
                            )}
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                {/* react-icons draws filled paths, so no strokeWidth here. */}
                                <MdOutlineContactSupport className='w-5 h-5' />
                            </div>
                            <span className={label_class}>SUPPORT</span>
                        </button>
                        <div className={divider_class} />
                    </div>
                </nav>
            </div>
        </aside>
    )
}
