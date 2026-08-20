import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import { useState } from "react"

interface SlotDescriptionModalProps {
    isOpen: boolean
    onClose: () => void
    slotName: string
    price: string
    description: string
    eventName?: string
}

export function SlotDescriptionModal({ isOpen, onClose, slotName, price, description, eventName = "Blackmarket Flea" }: SlotDescriptionModalProps) {
    console.log(price)
    const [quantity, setQuantity] = useState(1)
    const [view, setView] = useState<'description' | 'payment'>('description')

    // Parse price to number
    const numericPrice = parseInt(price.replace(/[^0-9]/g, '')) || 0
    const totalPrice = (numericPrice * quantity).toLocaleString()

    const handleSecureSlot = () => {
        setView('payment')
    }

    const resetView = () => {
        setView('description')
        setQuantity(1)
        onClose()
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && resetView()}>
            <DialogContent className="sm:max-w-[500px] flex flex-col p-6 bg-white border-none shadow-xl rounded-xl gap-0 overflow-hidden">
                {/* Close Button */}
                <DialogClose asChild className="absolute right-4 top-4 z-50">
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-black/5 rounded-full">
                        <X className="h-5 w-5 text-black" />
                    </Button>
                </DialogClose>

                {/* Header */}
                <div className="flex flex-col items-center justify-center pt-2 pb-6 space-y-1">
                    <h2 className="text-xl font-bold font-sf-pro-display text-black text-center">
                        {eventName}
                    </h2>
                    <h3 className="text-base font-semibold font-sf-pro-display text-black text-center">
                        {slotName}
                    </h3>
                </div>

                {view === 'description' ? (
                    <>
                        <div className="flex-1 overflow-y-auto mb-6 pr-2">
                            <p className="text-sm text-gray-600 capitalize">
                                {description}
                                </p>
                        </div>

                        {/* Footer - Description View */}
                        <div className="flex items-center justify-between mt-auto pt-4 border-gray-100">
                            {/* Quantity & Price */}
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold font-sf-pro-display text-black">x{quantity}</span>
                                </div>
                                <span className="text-lg font-medium font-sf-pro-display text-[#34C759]">{price}</span>
                            </div>

                            {/* Secure Slot Button */}
                            <Button
                                onClick={handleSecureSlot}
                                className="bg-deep-red hover:bg-deep-red/80 text-white rounded-lg px-6 h-10 font-bold font-sf-pro-display shadow-sm"
                            >
                                Secure Slot
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Payment View Content */}
                        <div className="flex flex-col items-center justify-center py-10 gap-2">
                            <div className="flex items-center gap-8">
                                <span className="text-xl font-bold font-sf-pro-display text-black">x{quantity}</span>
                                <span className="text-xl font-medium font-sf-pro-display text-black">₦{totalPrice}</span>
                            </div>
                        </div>

                        {/* Footer - Payment View */}
                        <div className="flex justify-center mt-auto pb-2 w-full px-6">
                            <Button
                                className="bg-deep-red hover:bg-deep-red/80 text-white rounded-lg h-10 font-medium font-sf-pro-display shadow-sm w-full"
                            >
                                Checkout
                            </Button>
                        </div>
                    </>
                )}

                {/* Floating Support Icon (Optional - if needed to match screenshot accurately) */}
                {/* <div className="absolute bottom-6 right-6">
                    <div className="h-10 w-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold">
                        E
                    </div>
                </div> */}

            </DialogContent>
        </Dialog>
    )
}
