import BaseModal from '@/components/reusable/base-modal'

interface Transaction {
    id: string
    eventName: string
    ticketType: string
    date: string
    amount: number
    status: 'pending' | 'paid' | 'in-review'
}

interface TransactionDetailsModalProps {
    isOpen: boolean
    onClose: () => void
    transaction: Transaction
}

export function TransactionDetailsModal({
    isOpen,
    onClose,
    transaction,
}: TransactionDetailsModalProps) {
    // Mock financial breakdown - replace with actual data
    const standardAccess = 10000
    const resalePrice = 18000
    const serviceFee = 1640
    const yourPayout = 16350

    return (
        <BaseModal
            open={isOpen}
            onClose={onClose}
            size='small'
            className='bg-[#1A1A1A] border border-white/10'>
            <div className='w-full flex flex-col gap-6 p-6'>
                {/* Title */}
                <h2 className='text-white text-lg font-inter-tight font-medium text-center relative'>
                    Transaction Details
                </h2>

                {/* Status Badge */}
                <div className='flex justify-center -mt-2'>
                    <span className='px-4 py-1 bg-[#198155] text-white rounded-full text-xs font-inter-tight font-medium'>
                        Sold
                    </span>
                </div>

                {/* Event Details Card */}
                <div className='bg-transparent border border-white/10 rounded-xl p-5 flex flex-col gap-6'>

                    {/* Event & Date Group */}
                    <div className='flex flex-col gap-4 border-b border-white/5 pb-4'>
                        <div className='flex items-start gap-3'>
                            <span className='text-deep-red mt-0.5'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 6h18v12c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6zm2-2V2h2v2h10V2h2v2h2c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2h2z" /></svg>
                            </span>
                            {/* Using SVG directly for Ticket/Event icon to match specific red outline look if needed, or stick to lucide */}
                            <div className='flex flex-col'>
                                <p className='text-white/40 text-xs font-inter-tight mb-1'>Event</p>
                                <p className='text-white font-inter-tight font-medium text-[15px]'>{transaction.eventName}</p>
                            </div>
                        </div>

                        <div className='flex items-start gap-3'>
                            <span className='text-deep-red mt-0.5'>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 0 0 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5v-5z" /></svg>
                            </span>
                            <div className='flex flex-col'>
                                <p className='text-white/40 text-xs font-inter-tight mb-1'>Date</p>
                                <p className='text-white font-inter-tight font-medium text-[15px]'>{transaction.date}</p>
                            </div>
                        </div>
                    </div>

                    {/* Ticket Type */}
                    <div className='flex flex-col gap-1'>
                        <p className='text-white/40 text-xs font-inter-tight'>Ticket Type</p>
                        <p className='text-white font-inter-tight font-medium text-[15px]'>{transaction.ticketType}</p>
                    </div>
                </div>

                {/* Financial Breakdown */}
                <div className='flex flex-col gap-4 mt-2'>
                    <h3 className='text-white font-inter-tight font-medium text-[15px]'>Financial Breakdown</h3>

                    <div className='bg-[#2A2A2A] rounded-xl p-5 flex flex-col gap-4'>
                        {/* Standard Access */}
                        <div className='flex items-center justify-between'>
                            <div className='flex items-center gap-3'>
                                <div className='w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-xs text-white/60 font-medium'>1</div>
                                <span className='text-white font-inter-tight text-[15px]'>Standard Access</span>
                            </div>
                            <span className='text-white font-inter-tight text-[15px]'>
                                ₦{standardAccess.toLocaleString()}
                            </span>
                        </div>

                        <div className='h-px bg-white/5 w-full' />

                        <div className='flex items-center justify-between'>
                            <span className='text-white/60 font-inter-tight text-[15px]'>Resale Price</span>
                            <span className='text-white font-inter-tight text-[15px]'>₦{resalePrice.toLocaleString()}</span>
                        </div>

                        <div className='flex items-center justify-between'>
                            <span className='text-white/60 font-inter-tight text-[15px]'>Service Fee</span>
                            <span className='text-white font-inter-tight text-[15px]'>₦{serviceFee.toLocaleString()}</span>
                        </div>

                        <div className='flex items-center justify-between mt-2'>
                            <span className='text-white/60 font-inter-tight text-[15px]'>Your Payout</span>
                            <span className='text-[#0066FF] font-inter-tight font-bold text-[15px]'>
                                ₦{yourPayout.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Success Footer */}
                <div className='bg-white/10 rounded-lg p-4 flex items-center gap-3 justify-center'>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white/60"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                    <p className='text-white/60 font-inter-tight text-[13px]'>
                        Funds Have Been Added To Your Wallet
                    </p>
                </div>
            </div>
        </BaseModal>
    )
}
