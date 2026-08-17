import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { X, Instagram, Twitter, Facebook, Linkedin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useAfroStore } from "@/stores"

export function ViewProfileModal() {
    const { user } = useAfroStore()
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" className="h-8 px-2 md:px-4 bg-secondary-white rounded-[4px] text-xs font-sf-pro-display text-black hover:bg-black/10">
                    <span className="hidden md:inline">View Profile</span>
                    <span className="md:hidden">View</span>
                </Button>
            </DialogTrigger>
            <DialogContent noCancel className="w-[95vw] sm:max-w-[600px] flex flex-col h-auto max-h-[90vh] bg-white p-0 gap-0 rounded-[24px] shadow-2xl border-0 overflow-hidden outline-none data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-500">
                <div
                    className="absolute z-[9999]"
                    style={{ top: '16px', right: '16px' }}
                >
                    <DialogClose asChild>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-10 w-10 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-black flex items-center justify-center border-0 shadow-none"
                        >
                            <X className="h-5 w-5 stroke-[2.5px]" />
                        </Button>
                    </DialogClose>
                </div>

                <div className="sr-only">
                    <DialogTitle>View Profile</DialogTitle>
                    <DialogDescription>Details of the vendor profile.</DialogDescription>
                </div>

                <div className="w-full py-0 flex items-center justify-center shrink-0 bg-white z-10 border-b border-gray-200">
                    <h2 className="text-black font-bold text-[16px] font-sf-pro-display tracking-tight py-3">Your Profile</h2>
                </div>

                <div className="flex flex-col items-center pt-0 pb-4 px-6 lg:px-8 gap-3 overflow-y-auto no-scrollbar w-full">
                    {/* Top Section: Avatar & Bio */}
                    <div className="flex flex-col items-center gap-2 w-full pt-2">
                        <div className="w-[80px] h-[80px] rounded-full bg-black flex items-center justify-center overflow-hidden border border-gray-100 shadow-sm shrink-0">
                            <img src="/assets/dashboard/store.png" alt="Profile" className="w-full h-full object-cover p-2" />
                        </div>

                        <div className="flex flex-col items-center text-center gap-2">
                            <h1 className="text-[22px] font-bold text-black font-sf-pro-display leading-tight tracking-tight">Cytech World Communication</h1>
                            <Badge className="bg-[#00C338] hover:bg-[#00C338] text-white text-[10px] font-sf-pro-rounded px-2.5 py-0.5 rounded-full uppercase font-bold border-none shadow-none tracking-wide">
                                service vendor
                            </Badge>
                        </div>

                        <p className="text-left text-gray-500 text-[12px] font-sf-pro-display leading-[1.4] w-full">
                            Cytech World brings events to life with top-tier equipment rentals—from sound and lighting to staging and LED screens. Trusted by organizers across Nigeria, we deliver fast, reliable setups that make every event unforgettable.
                        </p>
                    </div>

                    {/* Bottom Section: Split Columns */}
                    {/* Bottom Section: Split Columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full pt-4 pb-2 items-start h-full">
                        {/* Left Column: Contact Details */}
                        <div className="flex flex-col gap-3 h-full">
                            <p className="text-[14px] text-black font-medium font-sf-pro-display text-left mb-1">Contact Details</p>

                            <div className="flex flex-col gap-3 w-full text-[13px] font-sf-pro-display">
                                {/* Email Address */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-500 text-[11px] text-left font-normal">Email Address</p>
                                    <a href={`mailto:${user?.email}`} className="text-[#007AFF] text-[13px] font-normal hover:underline truncate">{user?.email}</a>
                                </div>

                                {/* Portfolio */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-500 text-[11px] text-left font-normal">Portfolio</p>
                                    <div className="flex flex-col gap-0.5 items-start text-[13px] font-normal text-[#007AFF]">
                                        {(() => {
                                            const portfolioUrl = user?.profile.businessData?.portfolio.webUrl || user?.profile.businessData?.portfolio.fileUrl
                                            return portfolioUrl ? (
                                                <a
                                                    href={portfolioUrl.startsWith('http') ? portfolioUrl : '#'}
                                                    target={portfolioUrl.startsWith('http') ? "_blank" : undefined}
                                                    rel="noopener noreferrer"
                                                    className="hover:underline block"
                                                >
                                                    {portfolioUrl.startsWith('http') ? 'view link' : 'view file'}
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">none added</span>
                                            )
                                        })()}
                                    </div>
                                </div>

                                {/* Socials */}
                                <div className="flex flex-col gap-1">
                                    <p className="text-gray-500 text-[11px] text-left font-normal">Socials</p>
                                    <div className="flex gap-3 items-center">
                                        {user?.profile.businessData?.socials && Object.values(user.profile.businessData.socials).some(l => !!l) ? (
                                            <>
                                                {user.profile.businessData.socials.instagram && (
                                                    <a href={user.profile.businessData.socials.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                        <Instagram className="h-4 w-4 text-black" />
                                                    </a>
                                                )}
                                                {user.profile.businessData.socials.x && (
                                                    <a href={user.profile.businessData.socials.x} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                        <Twitter className="h-4 w-4 text-black" />
                                                    </a>
                                                )}
                                                {user.profile.businessData.socials.facebook && (
                                                    <a href={user.profile.businessData.socials.facebook} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                        <Facebook className="h-4 w-4 text-black" />
                                                    </a>
                                                )}
                                                {user.profile.businessData.socials.linkedIn && (
                                                    <a href={user.profile.businessData.socials.linkedIn} target="_blank" rel="noopener noreferrer" className="hover:opacity-70 transition-opacity">
                                                        <Linkedin className="h-4 w-4 text-black" />
                                                    </a>
                                                )}
                                            </>
                                        ) : (
                                            <span className="text-gray-400 text-xs">none added</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Gallery */}
                        <div className="flex flex-col gap-4 items-center w-full h-full">
                            <p className="text-[14px] text-gray-500 font-medium font-sf-pro-display text-center w-full">Gallery</p>
                            <div className="grid grid-cols-2 gap-1 w-full h-full">
                                {user?.profile.gallery && user.profile.gallery.length > 0 ? (
                                    user.profile.gallery.map((img, i) => (
                                        <div key={i} className="aspect-[3/4] bg-gray-100 overflow-hidden relative rounded-[4px]">
                                            <img src={img} className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" alt={`Gallery ${i + 1}`} />
                                        </div>
                                    ))
                                ) : (
                                    <>
                                        <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative rounded-[4px]">
                                            <img src="/assets/landing-page/s1.png" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" alt="Gallery 1" />
                                        </div>
                                        <div className="aspect-[3/4] bg-gray-100 overflow-hidden relative rounded-[4px]">
                                            <img src="/assets/landing-page/s2.png" className="object-cover w-full h-full hover:scale-105 transition-transform duration-500" alt="Gallery 2" />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}