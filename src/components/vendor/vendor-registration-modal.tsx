import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { useForm } from 'react-hook-form'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { vendorRegistrationSchema, type VendorRegistrationFormData } from '@/schema/vendor-registration.schema'
import { VENDOR_CATEGORIES, type VendorNewsletterData } from '@/types/vendor'
import { useVendorNewsletterSubscription } from '@/hooks/use-newsletter'

interface VendorRegistrationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

export function VendorRegistrationModal({
    isOpen,
    onClose,
}: VendorRegistrationModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isShrinking, setIsShrinking] = useState(false)
    const [showSuccess, setShowSuccess] = useState(false)

    const subscribeMutation = useVendorNewsletterSubscription()

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm<VendorRegistrationFormData>({
        resolver: zodResolver(vendorRegistrationSchema) as any,
        defaultValues: {
            firstName: '',
            lastName: '',
            category: '',
            email: '',
            businessName: '',
            isRegistered: false,
            description: '',
        },
    })

    const isRegistered = watch('isRegistered')
    const category = watch('category')

    // Reset transient state each time the modal opens
    useEffect(() => {
        if (isOpen) {
            setIsShrinking(false)
            setShowSuccess(false)
            setIsSubmitting(false)
        }
    }, [isOpen])

    const onSubmit = (data: VendorRegistrationFormData) => {
        setIsSubmitting(true)

        const payload: VendorNewsletterData = {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            businessName: data.businessName,
            category: data.category,
            description: data.description,
            isRegisteredBusiness: data.isRegistered
        }

        subscribeMutation.mutate(payload, {
            onSuccess: () => {
                // Start shrink animation
                setIsShrinking(true)

                // Wait for shrink animation to complete before showing success
                setTimeout(() => {
                    setIsSubmitting(false)
                    setShowSuccess(true)
                }, 800)
            },
            onError: () => {
                setIsSubmitting(false)
            }
        })
    }

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && !isSubmitting) {
            onClose()
        }
    }

    const handleClose = () => {
        if (!isSubmitting) {
            onClose()
        }
    }

    // Safety check for document.body
    if (typeof document === 'undefined' || !document.body) {
        return null
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Invisible backdrop to catch outside clicks */}
                    <div
                        className="absolute inset-0"
                        onClick={handleBackdropClick}
                        aria-hidden="true"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.72 }}
                        animate={
                            isShrinking
                                ? {
                                    width: 400,
                                    height: 300,
                                    opacity: 1,
                                    scale: 1,
                                }
                                : { opacity: 1, scale: 1 }
                        }
                        exit={{ opacity: 0, scale: 0.72 }}
                        transition={{
                            duration: isShrinking ? 0.8 : 0.75,
                            ease: isShrinking ? 'easeInOut' : [0.22, 1, 0.36, 1],
                        }}
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[480px] max-h-[90vh] overflow-hidden"
                        style={{
                            WebkitUserSelect: 'none',
                            userSelect: 'none',
                            transform: 'translateZ(0)'
                        }}
                    >
                        {/* EXPANDED clickable area for iOS Safari - entire top portion */}
                        {!isSubmitting && (
                            <>
                                {/* Large invisible touch target covering top header area */}
                                <div
                                    onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        handleClose()
                                    }}
                                    className="absolute top-0 left-0 right-0 h-24 z-50 cursor-pointer"
                                    style={{
                                        WebkitTapHighlightColor: 'transparent',
                                        touchAction: 'manipulation',
                                    }}
                                    aria-label="Close modal area"
                                />
                                {/* Visual close button */}
                                <div className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-full pointer-events-none z-40 shadow-md">
                                    <X className="w-6 h-6 text-gray-700" strokeWidth={2.5} />
                                </div>
                            </>
                        )}
                        {/* SUCCESS CONTENT */}
                        <motion.div
                            animate={{ opacity: showSuccess ? 1 : 0 }}
                            transition={{ duration: 0.3 }}
                            className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center z-10 ${showSuccess ? 'pointer-events-auto' : 'pointer-events-none'}`}
                            style={{ pointerEvents: showSuccess ? 'auto' : 'none' }}
                        >
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/assets/landing-page/form-logo.png"
                                    alt="AFRO REVIVE"
                                    className="h-12 object-contain"
                                />
                            </div>
                            <h2 className="text-2xl font-bold text-black font-inter-tight mb-2">
                                CONGRATULATIONS!
                            </h2>
                            <p className="text-sm text-gray-700 font-inter-tight leading-relaxed">
                                Thank you for signing up. You'll be notified as soon as we officially launch.
                            </p>
                        </motion.div>

                        {/* FORM CONTENT */}
                        <motion.div
                            animate={{ opacity: showSuccess || isShrinking ? 0 : 1 }}
                            transition={{ duration: 0.3 }}
                            className={`p-6 md:p-8 overflow-y-auto max-h-[90vh] z-10 ${showSuccess ? 'pointer-events-none' : 'pointer-events-auto'}`}
                            style={{ pointerEvents: showSuccess ? 'none' : 'auto' }}
                        >
                            {/* Logo */}
                            <div className="flex justify-center mb-6">
                                <img
                                    src="/assets/landing-page/form-logo.png"
                                    alt="AFRO REVIVE"
                                    className="h-12 md:h-16 object-contain"
                                />
                            </div>

                            {/* Header */}
                            <div className="text-center mb-6">
                                <h2 className="text-2xl md:text-3xl font-bold text-black font-inter-tight mb-2">
                                    OWN THE SPOTLIGHT
                                </h2>
                                <p className="text-sm md:text-base text-gray-600 font-inter-tight">
                                    Tell us about you.
                                </p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 select-text">
                                {/* First Name & Last Name */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <Input
                                            {...register('firstName')}
                                            placeholder="FIRST NAME"
                                            onError={!!errors.firstName}
                                            disabled={isSubmitting}
                                            className="bg-white !text-black border-charcoal/30 placeholder:text-gray-400"
                                        />
                                        {errors.firstName && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.firstName.message}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <Input
                                            {...register('lastName')}
                                            placeholder="LAST NAME"
                                            onError={!!errors.lastName}
                                            disabled={isSubmitting}
                                            className="bg-white !text-black border-charcoal/30 placeholder:text-gray-400"
                                        />
                                        {errors.lastName && (
                                            <p className="text-xs text-red-600 mt-1">
                                                {errors.lastName.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                {/* Category */}
                                <div>
                                    <Select
                                        value={category}
                                        onValueChange={(value) => setValue('category', value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger className="w-full bg-[#1C1C1E] text-white border-0 h-11">
                                            <SelectValue placeholder="CATEGORY" />
                                        </SelectTrigger>
                                        <SelectContent className="z-[10005]">
                                            {VENDOR_CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.category && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.category.message}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <Input
                                        {...register('email')}
                                        type="email"
                                        placeholder="EMAIL ADDRESS"
                                        onError={!!errors.email}
                                        disabled={isSubmitting}
                                        className="bg-white !text-black border-charcoal/30 placeholder:text-gray-400"
                                    />
                                    {errors.email && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.email.message}
                                        </p>
                                    )}
                                </div>

                                {/* Business Name */}
                                <div>
                                    <Input
                                        {...register('businessName')}
                                        placeholder="BUSINESS NAME"
                                        onError={!!errors.businessName}
                                        disabled={isSubmitting}
                                        className="bg-white !text-black border-charcoal/30 placeholder:text-gray-400"
                                    />
                                    {errors.businessName && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.businessName.message}
                                        </p>
                                    )}
                                </div>

                                {/* Registration Checkbox */}
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isRegistered"
                                        checked={isRegistered}
                                        onCheckedChange={(checked) =>
                                            setValue('isRegistered', checked as boolean)
                                        }
                                        disabled={isSubmitting}
                                        className="border-charcoal/50"
                                    />
                                    <label
                                        htmlFor="isRegistered"
                                        className="text-sm text-gray-500 cursor-pointer"
                                    >
                                        Is your business registered?
                                    </label>
                                </div>

                                {/* Description */}
                                <div>
                                    <textarea
                                        {...register('description')}
                                        placeholder="DESCRIBE YOUR PRODUCT/SERVICE"
                                        rows={5}
                                        disabled={isSubmitting}
                                        className="w-full px-3 py-3 text-sm border border-charcoal/30 rounded-md focus:outline-none focus:border-black transition-colors resize-none bg-white !text-black placeholder:text-gray-400"
                                    />
                                    {errors.description && (
                                        <p className="text-xs text-red-600 mt-1">
                                            {errors.description.message}
                                        </p>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex justify-center pt-4">
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-auto px-12 h-10 bg-black text-white rounded-full font-inter-tight font-semibold text-sm hover:bg-gray-900 transition-colors disabled:opacity-50 uppercase"
                                    >
                                        {isSubmitting ? 'SUBMITTING...' : 'SUBMIT'}
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    )
}
