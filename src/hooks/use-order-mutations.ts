import { orderService } from "@/services/order.service";
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Hook for fetching order receipt details
 */


export function useOrderReceiptDetails() {
    return useMutation({
        mutationFn: (orderId: string) => orderService.getOrderReceiptDetails(orderId),
        onSuccess: (data) => {
            console.log('The Order Receipt Response: ', data.data)
        },
        onError: () => {
            toast.error('Failed to fetch order receipt details. Please try again.')
        }
    })
}