import { ticketService } from "@/services/tickets.service";
import { TicketResaleRequest } from "@/types/ticket";
import { useMutation, useQuery} from "@tanstack/react-query";
import { toast } from "sonner";

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

export function useGetUsersResaleTickets() {
    return useQuery({
        queryKey: ['user-resale-tickets'],
        queryFn: () => ticketService.getUsersResaleTickets(),
    })
}