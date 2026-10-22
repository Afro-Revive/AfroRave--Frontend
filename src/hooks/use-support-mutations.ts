import { apiErrorMessage } from '@/lib/api-error'
import { supportService } from '@/services/support.service'
import type { SupportMessageRequest } from '@/types/support'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

/** Sends a contact form to the support team. */
export function useSendSupportMessage() {
  return useMutation({
    mutationFn: (data: SupportMessageRequest) => supportService.sendSupportMessage(data),
    onSuccess: () => {
      toast.success('Thanks, your message is in. We’ll get back to you soon.')
    },
    onError: (error) => {
      toast.error(apiErrorMessage(error, 'Your message wasn’t sent. Please try again.'))
    },
  })
}
