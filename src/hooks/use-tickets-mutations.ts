import { ticketService } from "@/services/tickets.service";
import { TicketResaleRequest, TicketTransferRequest } from "@/types/ticket";
import { useMutation, useQuery} from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook for reselling tickets
 */
export function useTicketResale() {
    return useMutation({
        mutationKey: ['ticket-resale'],
        mutationFn: async (data: TicketResaleRequest[]) => {
            await ticketService.resellTickets(data);
        },
        onSuccess: () => {
            toast.success('Ticket resale successful.');
        },
        onError: () => {
            toast.error('Failed to resell tickets. Please try again.');
        },
    })
}

/**
 * 
 * Hook for getting users resale tickets
 */

export function useGetUsersResaleTickets() {
    return useQuery({
        queryKey: ['user-resale-tickets'],
        queryFn: () => ticketService.getUsersResaleTickets(),
    })
}

/**
 * Verify transfer recipient
 */

export function useVerifyTransferRecipient(){
    return useMutation({ 
        mutationKey: ['verify-transfer-recipient'],
        mutationFn: async (recipientEmail: string) => {
            return await ticketService.verifyTransferRecipient(recipientEmail);
        },
        onError: () => {
            toast.error('Failed to verify transfer recipient. Please try again.');
        }
    })
}

/**
 * Transfer Tickets
 */

export function useTransferTickets() {
    return useMutation({
        mutationKey: ['transfer-tickets'],
        mutationFn: (data: TicketTransferRequest[]) => ticketService.transferTickets(data),
        onSuccess: (data) => {
            toast.success(data.message);
        }
    })
}