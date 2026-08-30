import { ticketService } from "@/services/tickets.service";
import { TicketResaleRequest, TicketTransferRequest } from "@/types/ticket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Queries that go stale whenever a resale listing is created or cancelled:
 * the listings page itself, and the active tickets the listing came from /
 * returns to.
 */
const RESALE_AFFECTED_KEYS = [
    ['user-resale-tickets'],
    ['user-active-tickets'],
] as const;

/**
 * Hook for reselling tickets
 */
export function useTicketResale() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['ticket-resale'],
        mutationFn: async (data: TicketResaleRequest[]) => {
            await ticketService.resellTickets(data);
        },
        onSuccess: () => {
            toast.success('Ticket resale successful.');
            // invalidate both queries so both pages are refreshed with new data.
            RESALE_AFFECTED_KEYS.forEach((queryKey) =>
                queryClient.invalidateQueries({ queryKey }),
            );
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

/**
 * Cancel Resale Listing
 */

export function useCancelResaleListing() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['cancel-resale-listing'],
        mutationFn: (id: string) => ticketService.cancelResaleListing(id),
        onSuccess: () => {
            toast.success('Resale listing cancelled successfully.');
            RESALE_AFFECTED_KEYS.forEach((queryKey) =>
                queryClient.invalidateQueries({ queryKey }),
            );
        },
        onError: () => {
            toast.error('Failed to cancel resale listing. Please try again.');
        }
    })
}

/**
 * Edit Resale Listing Price
 */

export function useEditResaleListingPrice() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey: ['edit-resale-listing-price'],
        mutationFn: (
            { resellTicketId, price, newPrice }: 
            { resellTicketId: string, price: number, newPrice: number }) => 
            ticketService.editResaleListingPrice(resellTicketId, price, newPrice),
        onSuccess: () => {
            toast.success('Resale listing price updated successfully.');
            RESALE_AFFECTED_KEYS.forEach((queryKey) =>
                queryClient.invalidateQueries({ queryKey }),
            );
        },
        onError: () => {
            toast.error('Failed to update resale listing price. Please try again.');
        }
    })
}