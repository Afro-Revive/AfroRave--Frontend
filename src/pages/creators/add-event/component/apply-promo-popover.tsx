import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { useGetEventTickets } from '@/hooks/use-event-mutations'
import { useEventStore } from '@/stores'
import { useState } from 'react'
import { toast } from 'sonner'
import { SavedTicket } from '../ticket-forms/create/helper'
import { PaginatedResponse } from '@/types/api'

export function ApplyPromoCodePopover() {
    const { eventId } = useEventStore()
    const { data: ticketsData } = useGetEventTickets(eventId || '')
    const [selectedTickets, setSelectedTickets] = useState<string[]>([])
    const [open, setOpen] = useState(false)
    const ticketInformation = ticketsData?.data as PaginatedResponse<SavedTicket> | undefined
    const handleToggleTicket = (ticketId: string) => {
        setSelectedTickets((prev) =>
            prev.includes(ticketId) ? prev.filter((id) => id !== ticketId) : [...prev, ticketId],
        )
    }

    const handleApply = () => {
        toast.success('Promo code created successfully')
        setOpen(false)
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant='outline'
                    className='h-8 w-fit px-4 text-[10px] font-sf-pro-text font-medium rounded-[5px] border border-deep-red/70 text-deep-red bg-white hover:bg-red-50 uppercase'>
                    APPLY PROMO CODE
                </Button>
            </PopoverTrigger>
            <PopoverContent className='w-[280px] p-0 rounded-lg shadow-xl' align='end'>
                <div className='flex flex-col'>
                    <div className='p-3 border-b border-gray-100'>
                        <h4 className='text-xs font-medium font-sf-pro-text text-deep-red text-center uppercase'>
                            Apply Promo Code
                        </h4>
                    </div>

                    <div className='px-4 py-2 pb-0'>
                        <p className='text-[10px] text-gray-500 mb-2'>Choose Tickets</p>
                        <div className='flex flex-col gap-2 max-h-[200px] overflow-y-auto'>
                            {ticketInformation?.items?.map((ticket) => (
                                <div key={ticket.ticketId} className='flex items-center justify-between py-1'>
                                    <label
                                        htmlFor={ticket.ticketId}
                                        className='text-xs font-medium font-sf-pro-text text-charcoal cursor-pointer flex-1'>
                                        {ticket.ticketName}
                                    </label>
                                    <Checkbox
                                        id={ticket.ticketId}
                                        checked={selectedTickets.includes(ticket.ticketId)}
                                        onCheckedChange={() => handleToggleTicket(ticket.ticketId)}
                                        className='h-4 w-4 rounded-[2px] border-deep-red data-[state=checked]:bg-deep-red data-[state=checked]:text-white'
                                    />
                                </div>
                            ))}
                            {(!ticketInformation || ticketInformation.items.length === 0) && (
                                <p className='text-[10px] text-gray-400 italic'>No tickets found</p>
                            )}
                        </div>
                    </div>

                    <div className='p-3 flex justify-center'>
                        <Button
                            onClick={handleApply}
                            className='h-6 px-6 rounded-[4px] text-[10px] font-bold font-sf-pro-text text-white bg-deep-red hover:bg-deep-red/90 uppercase'>
                            apply
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
