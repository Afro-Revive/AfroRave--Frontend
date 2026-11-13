import { motion } from 'motion/react'

interface VendorSuccessOverlayProps {
    onClose: () => void
}

export function VendorSuccessOverlay({ onClose }: VendorSuccessOverlayProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, delay: 0.5 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
        >
            {/* Background overlay */}
            <div
                className="absolute inset-0 bg-black/50"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Success card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[400px] md:w-[400px] p-8 md:p-10"
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close"
                >
                    <svg
                        className="w-5 h-5 text-gray-600"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <img
                        src="/assets/landing-page/logo.png"
                        alt="AFRO REVIVE"
                        className="h-12 md:h-16 object-contain"
                    />
                </div>

                {/* Content */}
                <div className="text-center space-y-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-black font-inter-tight">
                        CONGRATULATIONS!
                    </h2>
                    <p className="text-sm md:text-base text-gray-700 font-inter-tight leading-relaxed">
                        Thank you for signing up. You'll be notified as soon as we officially
                        launch.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    )
}
