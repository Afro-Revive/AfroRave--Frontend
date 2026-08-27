import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Mail, CheckCircle2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useForgotPassword } from '@/hooks'
import { cn } from '@/lib/utils'

interface ForgotPasswordViewProps {
  onBack: () => void
  onDone: () => void
}

type Step = 'email' | 'success'

export function ForgotPasswordView({ onBack, onDone }: ForgotPasswordViewProps) {
  const {mutateAsync} = useForgotPassword()
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) {
      setEmailError('Please enter your email address.')
      return
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address.')
      return
    }
    setEmailError('')
    setIsLoading(true)
    mutateAsync({ email }).then(() => {
      setIsLoading(false)
      setStep('success')
    }).catch(() => {
      setIsLoading(false)
      setEmailError('Failed to send reset link. Please try again.')
    })
  }

  function handleResend() {
    setIsLoading(true)
     mutateAsync({ email }).then(() => {
      setIsLoading(false)
      setStep('success')
    }).catch(() => {
      setIsLoading(false)
      setEmailError('Failed to send reset link. Please try again.')
    })
  }

  return (
    <div className='w-[420px] h-fit rounded-[12px] !bg-white px-7 py-4 md:px-8 md:py-[37px] font-sf-pro-text'>
      <AnimatePresence mode='wait' initial={false}>
        {step === 'email' ? (
          <motion.div
            key='email-step'
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className='flex flex-col gap-5'>

            <div className='flex flex-col gap-1'>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                className='w-10 h-10 rounded-full bg-black flex items-center justify-center mb-1'>
                <Mail size={16} className='text-white' />
              </motion.div>
              <p className='text-2xl font-bold leading-[100%] text-black font-sf-pro-display'>
                Forgot password?
              </p>
              <p className='text-xs leading-relaxed text-black/50'>
                No worries. Enter your email and we'll send you a reset link.
              </p>
            </div>

            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
              <div className='flex flex-col gap-1.5'>
                <div
                  className={cn(
                    'w-full flex items-center gap-1 h-11 border rounded-[4px] px-3 transition-colors',
                    emailError ? 'border-red-400' : 'border-black',
                  )}>
                  <Mail color='#686868' size={12} />
                  <Input
                    type='email'
                    placeholder='Email Address.'
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      if (emailError) setEmailError('')
                    }}
                    className='h-full pl-0 rounded-none border-none !text-xs focus-visible:ring-0 shadow-none'
                  />
                </div>
                {emailError && (
                  <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-[10px] text-red-500'>
                    {emailError}
                  </motion.p>
                )}
              </div>

              <Button
                type='submit'
                disabled={isLoading}
                className='w-full py-5 text-base font-semibold font-sf-pro-text'>
                {isLoading ? (
                  <span className='flex items-center gap-2'>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                      className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block'
                    />
                    Sending...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </Button>
            </form>

            <button
              type='button'
              onClick={onBack}
              className='flex items-center gap-1.5 text-[10px] text-black/40 hover:text-black transition-colors self-start'>
              <ArrowLeft size={10} />
              Back to Sign In
            </button>
          </motion.div>
        ) : (
          <motion.div
            key='success-step'
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className='flex flex-col gap-5'>

            <div className='flex flex-col gap-1'>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.05, type: 'spring', stiffness: 220, damping: 14 }}
                className='w-10 h-10 rounded-full bg-black flex items-center justify-center mb-1'>
                <CheckCircle2 size={18} className='text-white' />
              </motion.div>
              <p className='text-2xl font-bold leading-[100%] text-black font-sf-pro-display'>
                Check your email
              </p>
              <p className='text-xs text-black/50 leading-relaxed'>
                We sent a password reset link to{' '}
                <span className='font-bold text-black'>{email}</span>
              </p>
            </div>

            <Button
              onClick={onDone}
              className='w-full py-5 text-base font-semibold font-sf-pro-text'>
              Done
            </Button>

            <p className='text-[10px] text-black/40'>
              Didn't receive it?{' '}
              <button
                type='button'
                onClick={handleResend}
                disabled={isLoading}
                className='font-bold text-black hover:underline disabled:opacity-50'>
                {isLoading ? 'Sending...' : 'Click to resend'}
              </button>
            </p>

            <button
              type='button'
              onClick={() => setStep('email')}
              className='flex items-center gap-1.5 text-[10px] text-black/40 hover:text-black transition-colors self-start'>
              <ArrowLeft size={10} />
              Back to enter email
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
