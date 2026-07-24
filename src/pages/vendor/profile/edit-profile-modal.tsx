import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogClose,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronRight, Upload, Instagram, X, Twitter, Facebook, Linkedin } from "lucide-react"
import { useState, useRef } from "react"
import { useAfroStore } from "@/stores"


export function VendorEditProfileModal({ customTrigger }: { customTrigger?: React.ReactNode }) {
    const { user } = useAfroStore()
    const [selectedMessage, setSelectedMessage] = useState<number | null>(null)
    const [portfolioFile, setPortfolioFile] = useState<File | null>(null)
    const [portfolioLink, setPortfolioLink] = useState(user?.profile.businessData?.portfolio || "")
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)
    const [isSocialsOpen, setIsSocialsOpen] = useState(false)
    const [socials, setSocials] = useState({
        instagram: typeof user?.profile.businessData.socials?.instagram === 'object' ? user.profile.businessData.socials.instagram || "" : "",
        twitter: typeof user?.profile.businessData.socials?.x === 'object' ? user.profile.businessData.socials.x || "" : "",
        facebook: typeof user?.profile.businessData.socials?.facebook === 'object' ? user.profile.businessData.socials.facebook || "" : "",
        linkedin: typeof user?.profile.businessData.socials?.linkedIn === 'object' ? user.profile.businessData.socials.linkedIn || "" : "",
    })

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPortfolioFile(e.target.files[0])
        }
    }

    const triggerFileUpload = () => {
        fileInputRef.current?.click()
    }

    const businessName = user?.profile.businessName || user?.profile.companyName || ""

    return (
        <Dialog>
            <DialogTrigger asChild>
                {customTrigger ? (
                    customTrigger
                ) : (
                    <Button
                        variant="destructive"
                        className="px-5 py-2.5 rounded-[6px] gap-3 h-8 bg-deep-red hover:bg-deep-red/80 text-white shadow-sm"
                    >
                        <span className="font-sf-pro-text text-xs capitalize">
                            Edit Profile
                        </span>
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent noCancel className="sm:max-w-[500px] w-[95vw] flex flex-col items-center h-[90vh] sm:h-[85vh] overflow-hidden rounded-[20px] p-0 bg-white gap-0 outline-none data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-500">
                <div className="sr-only">
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>Make changes to your vendor profile here.</DialogDescription>
                </div>
                <Tabs defaultValue="profile" className="w-full flex flex-col h-full overflow-hidden">
                    <div className="flex items-center justify-between w-full pt-4 pb-0 shrink-0 border-b border-gray-100 px-6">
                        <TabsList className="bg-transparent gap-6 h-10 p-0 justify-start flex-1">
                            <TabsTrigger value="profile" className="data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display border-b-2 border-transparent data-[state=active]:border-[#D32F2F] rounded-none px-0 pb-2 transition-all">Profile</TabsTrigger>
                            <TabsTrigger value="inbox" className="data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display border-b-2 border-transparent data-[state=active]:border-[#D32F2F] rounded-none px-0 pb-2 transition-all">Inbox</TabsTrigger>
                            <TabsTrigger value="account" className="data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display border-b-2 border-transparent data-[state=active]:border-[#D32F2F] rounded-none px-0 pb-2 transition-all">Account</TabsTrigger>
                        </TabsList>
                        <DialogClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 shrink-0 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-black flex items-center justify-center border-0 shadow-none mb-1"
                            >
                                <X className="h-4 w-4 stroke-[2.5px]" />
                            </Button>
                        </DialogClose>
                    </div>

                    <TabsContent value="profile" className="flex flex-col items-center gap-8 w-full p-6 pt-6 overflow-y-auto flex-1">
                        <div className="flex flex-col items-center gap-2">
                            <div className="size-[100px] rounded-full bg-black flex items-center justify-center overflow-hidden border border-gray-200 shadow-sm relative group cursor-pointer">
                                <img src="/assets/dashboard/store.png" alt="Profile" className="w-[60%] object-contain" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Upload className="text-white w-6 h-6" />
                                </div>
                            </div>
                            <Button variant="link" className="text-[#007AFF] h-auto p-0 text-[12px] font-medium hover:no-underline">Edit picture</Button>
                        </div>

                        <div className="w-full space-y-6">
                            {/* Form Fields Grid */}
                            <div className="grid grid-cols-[100px_1fr] gap-y-5 items-center w-full">
                                <Label htmlFor="name" className="text-gray-600 font-normal text-[13px]">Name</Label>
                                <Input id="name" defaultValue={`${user?.profile.firstName} ${user?.profile.lastName}`} className="text-black border-gray-300 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 w-full" />

                                <Label htmlFor="business" className="text-gray-600 font-normal text-[13px]">Business Name</Label>
                                <Input id="business" defaultValue={businessName} className="text-black border-gray-300 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 w-full" />

                                <Label htmlFor="email" className="text-gray-600 font-normal text-[13px]">Email Address</Label>
                                <Input id="email" defaultValue={user?.email} className="text-[#007AFF] border-gray-300 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 w-full" />

                                <Label htmlFor="phone" className="text-gray-600 font-normal text-[13px] whitespace-nowrap">Phone Number</Label>
                                <Input id="phone" defaultValue={user?.profile.phoneNumber} className="text-[#007AFF] border-gray-300 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 w-full" />

                                <Label htmlFor="gender" className="text-gray-600 font-normal text-[13px]">Gender</Label>
                                <Select defaultValue={user?.profile.gender || "female"}>
                                    <SelectTrigger className="w-full border-gray-300 text-gray-500 font-normal h-[42px] text-[13px] rounded-[6px] focus:ring-1 focus:ring-gray-400">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Collapsible Sections */}
                            <div className="flex flex-col border-t border-gray-100 mt-2">
                                {/* Portfolio */}
                                <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group hover:bg-gray-50/50 transition-colors" onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}>
                                    <div className="grid grid-cols-[100px_1fr] items-center w-full">
                                        <Label className="text-gray-600 font-normal text-[13px] cursor-pointer">Portfolio</Label>
                                        <span className="text-gray-400 text-[12px] font-normal">{portfolioFile ? 'File Attached' : 'Attach file / Add link'}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-black shrink-0" />
                                </div>
                                {isPortfolioOpen && (
                                    <div className="px-4 pb-4 pt-2 bg-gray-50 rounded-b-md mb-2">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-gray-500">Upload File</Label>
                                                <div className="flex items-center gap-2">
                                                    <Button type="button" variant="outline" size="sm" onClick={triggerFileUpload} className="h-8 text-xs border-dashed">
                                                        <Upload className="w-3 h-3 mr-2" />
                                                        {portfolioFile ? 'Change' : 'Upload'}
                                                    </Button>
                                                    {portfolioFile && <span className="text-xs text-green-600 truncate">{portfolioFile.name}</span>}
                                                </div>
                                                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} accept=".pdf,.doc,.docx,.jpg,.png" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <Label className="text-xs text-gray-500">Or Link</Label>
                                                <Input value={portfolioLink.toString()} onChange={(e) => setPortfolioLink(e.target.value)} placeholder="https://" className="h-8 text-xs bg-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Social Links */}
                                <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group hover:bg-gray-50/50 transition-colors" onClick={() => setIsSocialsOpen(!isSocialsOpen)}>
                                    <div className="grid grid-cols-[100px_1fr] items-center w-full">
                                        <Label className="text-gray-600 font-normal text-[13px] cursor-pointer">Social Links</Label>
                                        <span className="text-gray-400 text-[12px] font-normal">Add links</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-black shrink-0" />
                                </div>
                                {isSocialsOpen && (
                                    <div className="px-4 pb-4 pt-2 bg-gray-50 rounded-b-md mb-2">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-2">
                                                <Instagram className="w-4 h-4 text-gray-500" />
                                                <Input value={socials.instagram} onChange={(e) => setSocials(prev => ({ ...prev, instagram: e.target.value }))} placeholder="Instagram URL" className="h-8 text-xs bg-white" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Twitter className="w-4 h-4 text-gray-500" />
                                                <Input value={socials.twitter} onChange={(e) => setSocials(prev => ({ ...prev, twitter: e.target.value }))} placeholder="Twitter (X) URL" className="h-8 text-xs bg-white" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Facebook className="w-4 h-4 text-gray-500" />
                                                <Input value={socials.facebook} onChange={(e) => setSocials(prev => ({ ...prev, facebook: e.target.value }))} placeholder="Facebook URL" className="h-8 text-xs bg-white" />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Linkedin className="w-4 h-4 text-gray-500" />
                                                <Input value={socials.linkedin} onChange={(e) => setSocials(prev => ({ ...prev, linkedin: e.target.value }))} placeholder="LinkedIn URL" className="h-8 text-xs bg-white" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Gallery */}
                                <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group hover:bg-gray-50/50 transition-colors">
                                    <div className="grid grid-cols-[100px_1fr] items-center w-full">
                                        <Label className="text-gray-600 font-normal text-[13px] cursor-pointer">Gallery</Label>
                                        <span className="text-gray-400 text-[12px] font-normal">Add photos</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-black shrink-0" />
                                </div>
                            </div>

                            {/* Business Info */}
                            <div className="w-full flex flex-col items-center gap-3 pt-4">
                                <h3 className="text-black font-semibold font-sf-pro-display text-[16px]">Business Info</h3>
                                <div className="w-full relative">
                                    <span className="absolute top-2 right-2 text-[10px] text-gray-400">0/450</span>
                                    <textarea
                                        className="w-full min-h-[140px] p-4 rounded-[8px] border border-gray-300 text-[13px] focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none font-sf-pro-text text-gray-600"
                                        placeholder="Tell us about your business"
                                        defaultValue={user?.profile.description || ""}
                                    />
                                </div>
                            </div>

                            <Button className="w-full bg-deep-red hover:bg-deep-red/80 text-white h-[44px] rounded-[6px] font-medium text-[14px] shadow-sm mt-2 uppercase tracking-wide">
                                SAVE
                            </Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="inbox" className="w-full h-full flex flex-col p-0 overflow-hidden flex-1">
                        {!selectedMessage ? (
                            <>
                                <div className="flex items-center justify-between col-span-full border-b border-gray-100 pb-3 px-4 md:px-6">
                                    <div className="flex gap-2">
                                        <Button className="h-7 rounded-full bg-black text-white text-xs px-4">All</Button>
                                        <Button variant="ghost" className="h-7 rounded-full text-black hover:bg-gray-100 text-xs px-4 bg-gray-100">Unread (4)</Button>
                                    </div>
                                    <button className="text-[10px] text-deep-red hover:underline">Mark all as read</button>
                                </div>

                                <div className="flex flex-col w-full h-full overflow-y-auto mt-2 px-4 md:px-6 py-2 gap-6">
                                    <div className="flex flex-col gap-3">
                                        <p className="text-gray-400 text-xs sticky top-0 bg-white py-1 z-10">Yesterday</p>
                                        {[1, 2, 3].map((_, i) => (
                                            <div
                                                key={i}
                                                onClick={() => setSelectedMessage(i)}
                                                className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2"
                                            >
                                                <div className="size-10 rounded-full bg-black flex-shrink-0 overflow-hidden border border-gray-100">
                                                    <img src="/assets/dashboard/store.png" alt="Icon" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-1 gap-0.5">
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="font-semibold text-sm text-black truncate max-w-[140px] sm:max-w-[200px]">Urban Rise Festival Vol 3</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400 text-[10px] md:text-xs">June 12</span>
                                                            <div className="size-2 rounded-full bg-deep-red shrink-0" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate w-full">You've Been Accepted As...</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        <p className="text-gray-400 text-xs sticky top-0 bg-white py-1 z-10">7 Days Ago</p>
                                        {[4, 5, 6].map((_, i) => (
                                            <div key={i} className="flex items-center gap-3 border-b border-gray-50 pb-3 last:border-0 cursor-pointer hover:bg-gray-50 transition-colors rounded-lg p-2 -mx-2">
                                                <div className="size-10 rounded-full bg-black flex-shrink-0 overflow-hidden border border-gray-100">
                                                    <img src="/assets/dashboard/store.png" alt="Icon" className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col flex-1 gap-0.5">
                                                    <div className="flex justify-between items-center w-full">
                                                        <p className="font-semibold text-sm text-black truncate max-w-[140px] sm:max-w-[200px]">Urban Rise Festival Vol 3</p>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-gray-400 text-[10px] md:text-xs">June 12</span>
                                                            <div className="size-2 rounded-full bg-deep-red shrink-0" />
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-gray-500 truncate w-full">You've Been Accepted As...</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex flex-col w-full h-full px-4 md:px-6">
                                <div className="flex items-center gap-2 pb-4 border-b border-gray-100 mb-4 sticky top-0 bg-white pt-2 z-10">
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedMessage(null)} className="-ml-3 h-8 w-8 hover:bg-gray-100 rounded-full">
                                        <ChevronRight className="h-5 w-5 rotate-180 text-black" />
                                    </Button>
                                    <div className="flex items-center gap-2">
                                        <div className="size-6 rounded-full bg-black overflow-hidden border border-gray-200">
                                            <img src="/assets/dashboard/store.png" alt="Icon" className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-semibold text-sm text-black truncate max-w-[200px]">Urban Rise Festival Vol 3</span>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto pb-6">
                                    <div className="border border-blue-500 rounded-lg p-4 flex flex-col gap-2 relative overflow-hidden bg-blue-50/10">
                                        <div className="flex items-start gap-3 md:gap-4 z-10 relative">
                                            <div className="size-10 md:size-12 rounded-full bg-black flex-shrink-0 overflow-hidden border-2 border-white shadow-sm">
                                                <img src="/assets/dashboard/store.png" alt="Icon" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="font-bold text-sm text-black">Urban Rise Festival Vol 3</p>
                                                <p className="text-xs leading-relaxed text-gray-600">
                                                    You've been accepted as a vendor for Lagos Street Jam.
                                                    Lock in your spot by completing the payment.
                                                </p>
                                            </div>
                                        </div>

                                        <Button className="w-full bg-deep-red hover:bg-deep-red/80 text-white font-semibold text-xs md:text-sm h-9 md:h-10 mt-3 shadow-sm rounded-md transition-all">
                                            Secure Slot
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="account" className="flex-1">
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                            Account settings coming soon.
                        </div>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}
