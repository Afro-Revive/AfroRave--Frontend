import { LoadingFallback } from '@/components/loading-fallback'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ChevronLeft, Info, MoreHorizontal } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetEvent } from '@/hooks/use-event-mutations'
import { cn } from '@/lib/utils'
import { useState } from 'react'
import { EventDetailData } from '@/types/event'

export default function VendorEventDetailsPage() {
    const { eventId } = useParams()
    const navigate = useNavigate()
    const { data: eventResponse, isPending: isLoading } = useGetEvent(eventId || '')
    const event = eventResponse?.data as EventDetailData | undefined
    const [isExpanded, setIsExpanded] = useState(false)

    if (isLoading) return <LoadingFallback />

    if (!event) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
                <p className="text-xl font-bold mb-4">Event not found</p>
                <Button onClick={() => navigate(-1)}>Go Back</Button>
            </div>
        )
    }

    return (
        <section className="w-full h-full flex flex-col bg-[#F2F2F7] md:bg-white min-h-screen">
            {/* Header */}
            <div className="w-full h-14 flex items-center justify-between px-4 md:px-8 bg-white border-b md:border-none md:hidden">
                <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-3">
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button className="bg-[#D32F2F] text-white hover:bg-[#b71c1c] text-xs h-8 px-4 rounded-[4px]">
                    View Section Map
                </Button>
            </div>

            {/* Desktop Header */}
            <div className="hidden md:flex w-full h-16 items-center justify-between px-8 bg-white mb-6">
                <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 pl-0 hover:bg-transparent text-black">
                    <ChevronLeft className="h-5 w-5" />
                    <span className="text-lg">Back</span>
                </Button>
                <Button className="bg-[#D32F2F] text-white hover:bg-[#b71c1c]">
                    View Section Map
                </Button>
            </div>

            <div className="flex flex-1 flex-col md:flex-row gap-6 p-4 md:px-8 max-w-[1440px] mx-auto w-full">
                {/* Left Column: Event Info */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Banner */}
                    <div className="w-full aspect-[4/3] md:aspect-video rounded-[20px] overflow-hidden bg-gray-100 shadow-sm relative">
                        <img
                            src={event.eventDetails.desktopMedia?.flyer}
                            alt={event.eventName}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl md:text-3xl font-black font-sf-pro-display uppercase leading-tight">
                            {event.eventName}
                        </h1>
                        <div className="flex flex-col text-sm md:text-base text-gray-600 font-sf-pro-display">
                            <p>{event.venue}</p>
                            <p>{new Date(event.eventDate.startDate).toLocaleDateString('en-US', {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                            })}</p>
                            <div className="mt-2">
                                <span className="inline-block px-3 py-1 bg-[#34C759]/10 text-[#34C759] text-xs font-bold rounded-full uppercase">
                                    Upcoming
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* About Event */}
                    <div className="bg-[#8E8E93] text-white rounded-[20px] p-6 relative overflow-hidden">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold">About Event</h3>
                            <Info className="w-5 h-5 opacity-70" />
                        </div>

                        <div className={cn("text-sm leading-relaxed opacity-90 transition-all duration-300",
                            isExpanded ? "line-clamp-none" : "line-clamp-6"
                        )}>
                            {event.description ||
                                "We're Looking For Food Vendors To Serve A Variety Of Delicious Meals, Snacks, Or Beverages To Our Attendees. This Slot Is Ideal For Mobile Food Trucks, Grills, Or Packaged Treats. What We're Looking For: - Quick-Service Or Grab-And-Go Options - Clean And Appealing Booth/Truck Setups - Ability To Handle High Foot Traffic - Compliance With Health And Safety Standards Electricity And Water Access Will Be Provided On-Site. Vendors Must Arrive 2 Hours Before Event Start For Setup And Be Fully Self-Sufficient."}
                        </div>

                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-1"
                        >
                            <div className="w-1 h-8 rounded-full bg-white/50" />
                        </button>
                    </div>
                </div>

                {/* Right Column: Cards (Desktop) or Bottom (Mobile) */}
                <div className="w-full md:w-[400px] flex flex-col gap-4">
                    {/* Vendor Slot Card */}
                    <Card className="p-6 rounded-[20px] bg-white border-none shadow-sm flex flex-col gap-6">
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h3 className="font-bold text-sm uppercase">OUTDOOR FOOD STALL A</h3>
                                <p className="text-xs text-gray-500 mt-1">Food And Drinks</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-5 w-5 text-gray-400" />
                            </Button>
                        </div>

                        <div className="flex flex-col gap-4 text-sm">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Price Per Slot:</span>
                                <span className="font-bold">₦200,000</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Available Slots:</span>
                                <span className="text-[#34C759] font-bold">5</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Sales Channel:</span>
                                <span className="lowercase">online only</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">Application Deadline:</span>
                                <span>Oct 20, 2025</span>
                            </div>
                        </div>

                        <Button className="w-full bg-black text-white hover:bg-gray-800 h-12 rounded-[10px] uppercase font-bold text-sm">
                            Register For Slot
                        </Button>
                    </Card>
                </div>
            </div>
        </section>
    )
}
