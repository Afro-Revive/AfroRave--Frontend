import { useNavigate, useLocation } from 'react-router-dom'
import { useLogout } from '@/hooks/use-auth'
import { ChevronLeft, Zap, Settings, LogOut } from 'lucide-react'
import './sidebar.css'

export default function AccountSidebar() {
    const navigate = useNavigate()
    const location = useLocation()
    const logoutMutation = useLogout()

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const isProfileActive = () => {
        return location.pathname === '/fans/account' && !location.search.includes('account=wallet')
    }

    return (
        <aside className='fan-sidebar-container'>
            <div className="fan-sidebar-content">
                {/* Back Button */}
                <div className="pl-0 mb-12">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center justify-center w-8 h-8 text-white hover:text-white/80 transition-colors"
                        aria-label="Go back"
                    >
                        <ChevronLeft className="w-6 h-6" strokeWidth={2} />
                    </button>
                </div>

                {/* Navigation Items */}
                <nav className='flex flex-col gap-0'> {/* Removed gap-2 to bring items closer */}
                    {/* PROFILE */}
                    <div className='mb-4'>
                        <button
                            onClick={() => navigate('/fans/account')}
                            className={`fan-sidebar-link group relative ${isProfileActive()
                                ? 'fan-sidebar-link-active'
                                : ''
                                }`}
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                <Zap className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <span className='fan-sidebar-text'>PROFILE</span>
                        </button>
                        <div className="h-[1px] bg-white/10 w-full ml-[60px]"></div>
                    </div>

                    {/* SETTINGS */}
                    <div className='mb-4'>
                        <button
                            onClick={() => navigate('/fans/settings')}
                            className={`fan-sidebar-link group relative ${location.pathname === '/fans/settings'
                                ? 'fan-sidebar-link-active'
                                : ''
                                }`}
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                <Settings className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <span className='fan-sidebar-text'>SETTINGS</span>
                        </button>
                        <div className="h-[1px] bg-white/10 w-full ml-[60px]"></div>
                    </div>

                    {/* LOG OUT */}
                    <div className='mb-4'>
                        <button
                            onClick={handleLogout}
                            className='fan-sidebar-link group relative'
                        >
                            <div className='w-5 h-5 flex items-center justify-center shrink-0 text-deep-red'>
                                <LogOut className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <span className='fan-sidebar-text'>LOG OUT</span>
                        </button>
                        <div className="h-[1px] bg-white/10 w-full ml-[60px]"></div>
                    </div>
                </nav>
            </div>
        </aside>
    )
}