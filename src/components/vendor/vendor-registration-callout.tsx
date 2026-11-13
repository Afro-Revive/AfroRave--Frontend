import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'
import { useEffect, useState } from 'react'

interface VendorRegistrationCalloutProps {
    onOpen: () => void
    delay?: number
}

export function VendorRegistrationCallout({ onOpen, delay = 1500 }: VendorRegistrationCalloutProps) {
    const [isVisible, setIsVisible] = useState(false)
    const [isDismissed, setIsDismissed] = useState(false)

    useEffect(() => {
        // Check if callout was previously dismissed in this session
        // const dismissed = sessionStorage.getItem('vendorCalloutDismissed')

        // if (dismissed === 'true') {
        //     setIsDismissed(true)
        //     return
        // }

        // Show callout after specified delay
        const timer = setTimeout(() => {
            setIsVisible(true)
        }, delay)

        return () => {
            clearTimeout(timer)
        }
    }, [delay])

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation()
        setIsVisible(false)
        setIsDismissed(true)
        sessionStorage.setItem('vendorCalloutDismissed', 'true')
    }

    const handleClick = () => {
        setIsVisible(false)
        onOpen()
    }

    if (isDismissed) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="fixed top-20 right-2 md:right-8 z-[99999] pointer-events-auto"
                >
                    <div
                        onClick={handleClick}
                        className="bg-white rounded-lg shadow-lg p-3 pr-8 md:p-4 md:pr-10 relative w-[240px] md:w-[400px] cursor-pointer hover:shadow-xl transition-shadow pointer-events-auto"
                    >
                        <button
                            onClick={handleDismiss}
                            className="absolute top-1.5 right-1.5 md:top-2 md:right-2 p-1 hover:bg-gray-100 rounded-full transition-colors z-10 pointer-events-auto"
                            aria-label="Close"
                        >
                            <X className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600" />
                        </button>
                        <p className="text-xs md:text-base font-bold text-black font-inter-tight leading-tight pointer-events-none">
                            ARE YOU A VENDOR?
                        </p>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
