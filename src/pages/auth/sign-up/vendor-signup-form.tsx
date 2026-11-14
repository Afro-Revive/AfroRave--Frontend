import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
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

interface VendorSignupFormProps {
    onSwitchToLogin?: () => void
}

export function VendorSignupForm({ onSwitchToLogin }: VendorSignupFormProps = {}) {
    const [isSubmitting, setIsSubmitting] = useState(false)
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
                setIsSubmitting(false)
                setShowSuccess(true)
            },
            onError: () => {
                setIsSubmitting(false)
            }
        })
    }

    if (showSuccess) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center bg-transparent rounded-2xl max-w-[480px] mx-auto">
                <div className="flex justify-center mb-6">
                    <img
                        src="/assets/landing-page/logo.png"
                        alt="AFRO REVIVE"
                        className="h-12 object-contain"
                    />
                </div>
                <h2 className="text-2xl font-bold text-white font-inter-tight mb-2">
                    CONGRATULATIONS!
                </h2>
                <p className="text-sm text-white/80 font-inter-tight leading-relaxed">
                    Thank you for signing up. You'll be notified as soon as we officially launch.
                </p>
            </div>
        )
    }

    return (
        <div className="p-6 md:p-8 bg-transparent rounded-2xl max-w-[480px] mx-auto">
            {/* Logo */}
            <div className="flex justify-center mb-6">
                <img
                    src="/assets/landing-page/logo.png"
                    alt="AFRO REVIVE"
                    className="h-12 md:h-16 object-contain"
                />
            </div>

            {/* Header */}
            <div className="text-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-white font-inter-tight mb-2">
                    OWN THE SPOTLIGHT
                </h2>
                <p className="text-sm md:text-base text-white/80 font-inter-tight">
                    Tell us about you.
                </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <Input
                            {...register('firstName')}
                            placeholder="FIRST NAME"
                            onError={!!errors.firstName}
                            disabled={isSubmitting}
                            className="bg-white/10 !text-white border-white/30 placeholder:text-white/50"
                        />
                        {errors.firstName && (
                            <p className="text-xs text-red-400 mt-1">
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
                            className="bg-white/10 !text-white border-white/30 placeholder:text-white/50"
                        />
                        {errors.lastName && (
                            <p className="text-xs text-red-400 mt-1">
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
                        <SelectContent className="z-[1000001]">
                            {VENDOR_CATEGORIES.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors.category && (
                        <p className="text-xs text-red-400 mt-1">
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
                        className="bg-white/10 !text-white border-white/30 placeholder:text-white/50"
                    />
                    {errors.email && (
                        <p className="text-xs text-red-400 mt-1">
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
                        className="bg-white/10 !text-white border-white/30 placeholder:text-white/50"
                    />
                    {errors.businessName && (
                        <p className="text-xs text-red-400 mt-1">
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
                        className="border-white/50"
                    />
                    <label
                        htmlFor="isRegistered"
                        className="text-sm text-white/70 cursor-pointer"
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
                        className="w-full px-3 py-3 text-sm border border-white/30 rounded-md focus:outline-none focus:border-white/50 transition-colors resize-none bg-white/10 !text-white placeholder:text-white/50"
                    />
                    {errors.description && (
                        <p className="text-xs text-red-400 mt-1">
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

                {/* Login Link */}
                {onSwitchToLogin && (
                    <div className='flex items-center justify-center gap-1 text-sm text-white font-inter-tight mt-4'>
                        Already have an account?{' '}
                        <button
                            type='button'
                            onClick={onSwitchToLogin}
                            className='text-base font-bold text-accent hover:underline'>
                            Log In
                        </button>
                    </div>
                )}
            </form>
        </div>
    )
}
