import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ChevronLeft, Search } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetVendorApplications } from '@/hooks/use-event-mutations'
import { cn } from '@/lib/utils'
import { formatNaira } from '@/lib/format-price'
import { stripUnderscores } from '@/lib/helper-func'
import { SlotDescriptionModal } from './slot-description-modal'
import VendorDashboardHeader from '@/layouts/vendor-dashboard-layout/sections/header'
import { useState } from 'react'
import { PaginatedResponse } from '@/types'
import { VendorApplications } from '@/types/vendor'
import { LoadingFallback } from '@/components/loading-fallback'

function getSlotName(application: VendorApplications): string {
    const isRevenue = application.vendorType === "Revenue"
    return (
        (isRevenue ? application.vendorDetails.slotData?.slotName : application.vendorDetails.serviceData?.serviceName) 
    )
}

function getSlotPriceLabel(application: VendorApplications): string {
    const isRevenue = application.vendorType === "Revenue"
    if (isRevenue) {
        return `${formatNaira(application.vendorDetails.slotData?.price ?? 0)} Per Slot`
    }
    const serviceData = application.vendorDetails.serviceData
    if (serviceData?.hasBudgetRange) {
        return `${formatNaira(serviceData.minBudget)}  -  ${formatNaira(serviceData.maxBudget)}`
    }
    // for a service vendor it should return the price offered by the vendor
    // if no price is offered it should return 0
    // currently the backend does not return the price offered by the vendor for service vendors, so we will just return 0 for now
    return `${formatNaira(0)} Budget`
}

export default function VendorSlotDetailsPage() {
    const navigate = useNavigate()
    const { eventId } = useParams<{ eventId: string }>()
    const [selectedSlot, setSelectedSlot] = useState<VendorApplications | null>(null)
    const { data, isLoading } = useGetVendorApplications()
    const applications = data?.data as PaginatedResponse<VendorApplications> | undefined
    const vendorApplications = applications?.items as VendorApplications[] | undefined
    const eventApplications = vendorApplications?.filter(app => app.eventId === eventId) || []
    const eventName = eventApplications[0]?.eventName
    const [searchQuery, setSearchQuery] = useState('')

    const filteredApplications = eventApplications.filter((application) =>
        getSlotName(application).toLowerCase().includes(searchQuery.toLowerCase()) ||
        application.category.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (isLoading) {
        return <LoadingFallback />
    }

    return (
        <section className="w-full min-h-screen flex flex-col bg-[#F5F5F7]">
            {/* Main Header */}
            <VendorDashboardHeader />

            {/* Sub Header */}
            <div className="w-full h-17.5 flex items-center justify-between px-4 md:px-10 bg-white border-b border-gray-100/50 sticky top-0 z-20">
                <div className="flex items-center gap-2 max-w-[70%]">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)} className="-ml-3 hover:bg-gray-50 rounded-full h-9 w-9 shrink-0">
                        <ChevronLeft className="h-5 w-5 text-black stroke-[1.5px]" />
                    </Button>
                    <h1 className="text-lg font-bold font-sf-pro-display text-black truncate">
                        {eventName}
                    </h1>
                </div>
            </div>

            <div className="p-4 md:px-10 md:py-8 flex flex-col gap-6 flex-1 h-full">
                {/* Content Card with Search Bar */}
                <div className="w-full flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 h-full">

                    {/* Search Bar (Inside Card) */}
                    <div className="w-full flex items-center gap-4 p-4 md:p-5 border-b border-gray-100">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-[#8E8E93]" />
                            <Input
                                placeholder="Search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8 bg-transparent border-none h-10 rounded-none font-sf-pro-text text-[15px] placeholder:text-[#8E8E93] focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {filteredApplications.length > 0 ? (
                            filteredApplications.map((slot) => {
                                return (
                                    <div
                                        key={slot.id}
                                        onClick={() => setSelectedSlot(slot)}
                                        className="flex items-center justify-between p-4 md:p-5 border-b border-gray-50 last:border-none cursor-pointer hover:bg-gray-50/50 transition-colors group gap-3"
                                    >
                                        {/* Name & Type */}
                                        <div className="flex flex-col gap-1 min-w-0 flex-1">
                                            <p className="font-sf-pro-display font-medium text-[15px] text-[#1C1C1E] truncate">{getSlotName(slot)}</p>
                                            <div className="flex items-center gap-1 font-sf-pro-text text-[11px] text-[#8E8E93] truncate">
                                                <span className="truncate">{stripUnderscores(slot.category)}</span>
                                                <span className="md:hidden text-tech-blue font-medium shrink-0">• {slot.requestedSlots} Slots</span>
                                            </div>
                                        </div>

                                        {/* Quantity (Hidden on very small screens, shown on md+) */}
                                        <div className="hidden md:flex justify-center w-1/6 shrink-0">
                                            <span className="font-sf-pro-display font-medium text-[15px] text-tech-blue">{slot.requestedSlots}</span>
                                        </div>

                                        {/* Status */}
                                        <div className="flex items-center justify-end gap-2 shrink-0 px-3">
                                            <StatusBadge status={slot.status} />

                                        {
                                            /**
                                             * Not in use for now, as a user cannot revoke a request once it has been made.
                                             */
                                        }
                                            {/* Kebab Menu */}
                                            {/* <div className="w-8 md:w-10 flex justify-end" onClick={(e) => e.stopPropagation()}>
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-100 rounded-full opacity-50 group-hover:opacity-100 transition-opacity">
                                                            <MoreVertical className="h-4 w-4 text-[#1C1C1E]" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-45 bg-[#1C1C1E]/90 backdrop-blur-md border-none text-white shadow-xl rounded-lg p-1">
                                                        <DropdownMenuItem className="text-[13px] font-sf-pro-text text-white focus:bg-white/10 focus:text-white cursor-pointer h-9 px-3 rounded-md">
                                                            Revoke Request
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div> */}
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center h-full text-gray-400">
                                <Search className="h-8 w-8 mb-2 opacity-50" />
                                <p className="font-sf-pro-text text-sm">No slots found</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selectedSlot && (
                <SlotDescriptionModal
                    isOpen={!!selectedSlot}
                    onClose={() => setSelectedSlot(null)}
                    slotName={getSlotName(selectedSlot)}
                    description={selectedSlot.description}
                    price={getSlotPriceLabel(selectedSlot)}
                    eventName={eventName}
                />
            )}
        </section>
    )
}

function StatusBadge({ status, className }: { status: string, className?: string }) {
    const getStatusColor = (s: string) => {
        switch (s.toLowerCase()) {
            case 'pending': return 'text-[#FF9500]' // Orange
            case 'approved': return 'text-[#34C759]' // Green
            case 'rejected': return 'text-deep-red'
            default: return 'text-[#8E8E93]'
        }
    }

    return (
        <span className={cn("text-[13px] font-sf-pro-display font-medium whitespace-nowrap", getStatusColor(status), className)}>
            {status}
        </span>
    )
}
