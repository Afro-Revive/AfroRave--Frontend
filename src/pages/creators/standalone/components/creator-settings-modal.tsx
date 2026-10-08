import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useOrganizerNotifications } from "@/hooks/use-profile-mutations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, ChevronRight, Eye, EyeOff, LogOut, X } from "lucide-react"
import { useGetNigerianBanks } from "@/hooks/use-payments"
import { useEffect, useMemo, useState } from "react"
import { formatMonthDay, relativeDateGroup } from "@/lib/helper-func"
import { useAfroStore } from "@/stores"
import { useLogout, useChangePassword } from '@/hooks/use-auth'
import { useMarkNotificationAsRead, useOrganizerProfile, useUpdateOrganizerProfile } from '@/hooks/use-profile-mutations'
import { formToasts } from '@/lib/toast'
import { NotificationData, OrganizerProfileData } from "@/types/profile"
import type { PaginatedResponse } from "@/types/api"
import { NigerianBanksResponse } from "@/types/payments"

interface CreatorSettingsModalProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** @deprecated use open/onOpenChange instead */
    customTrigger?: React.ReactNode
}


export function CreatorSettingsModal({ open, onOpenChange, customTrigger }: CreatorSettingsModalProps) {
    const { user } = useAfroStore()
    const logoutMutation = useLogout()
    const changePasswordMutation = useChangePassword()
    const { data: profileData } = useOrganizerProfile()
    const updateProfileMutation = useUpdateOrganizerProfile()

    // Sub-views
    const [showBankDetails, setShowBankDetails] = useState(false)
    const [showChangePassword, setShowChangePassword] = useState(false)

    // Bank details
    const {mutate: fetchBanks, data: banksData } = useGetNigerianBanks()
    const NIGERIAN_BANKS = banksData?.data as NigerianBanksResponse[] | undefined || []

    // Inbox
    const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all')
    const { data: notificationsData } = useOrganizerNotifications()
    const markAsReadMutation = useMarkNotificationAsRead()
    const [locallyRead, setLocallyRead] = useState<string[]>([])

    // Memoize notifications with viewed status (local or remote) and group.
    const notifications = useMemo(() => {
        const payload = notificationsData?.data
        const items = Array.isArray(payload)
            ? (payload as NotificationData[])
            : ((payload as PaginatedResponse<NotificationData> | undefined)?.items ?? [])
        return items.map((n) => ({
            ...n,
            viewed: n.viewed || locallyRead.includes(n.id),
            group: relativeDateGroup(n.createdDate),
        }))
    }, [notificationsData, locallyRead])

    // Account
    const [orderNotification, setOrderNotification] = useState<'daily' | 'weekly' | 'disabled'>('disabled')

    // Profile form state — pre-filled from store, then overridden by API data
    const [firstName, setFirstName] = useState(user?.profile?.firstName || "")
    const [lastName, setLastName] = useState(user?.profile?.lastName || "")
    const [gender, setGender] = useState(user?.profile?.gender || "")
    const [companyName, setCompanyName] = useState(user?.profile?.companyName || "")
    const [telphone, setTelphone] = useState(user?.profile?.phoneNumber || "")
    const [portfolioLink, setPortfolioLink] = useState(
      user?.profile?.businessData?.portfolio?.webUrl ||
        user?.profile?.businessData?.portfolio?.fileUrl ||
        "",
    )
    const [isPortfolioOpen, setIsPortfolioOpen] = useState(false)

    // Change password form state
    const [currentPassword, setCurrentPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)

    // Pre-fill profile form from API data when it loads
    useEffect(() => {
        if (profileData?.data) {
            const p = profileData.data as OrganizerProfileData
            if (p.businessName) setCompanyName(p.businessName)
            if (p.contactPhone) setTelphone(p.contactPhone)
            if (p.website) setPortfolioLink(p.website)
        }
        fetchBanks()
    }, [profileData, fetchBanks])

    const unreadCount = notifications.filter(n => !n.viewed).length
    const visibleNotifications = inboxFilter === 'unread'
        ? notifications.filter(n => !n.viewed)
        : notifications

    const groups = Array.from(new Set(visibleNotifications.map(n => n.group)))

    const handleMarkAllRead = () => {
        const unread = notifications.filter(n => !n.viewed)
        // Clear the dots straight away, then persist each one.
        setLocallyRead(prev => [...prev, ...unread.map(n => n.id)])
        unread.forEach(n => markAsReadMutation.mutate(n.id))
    }

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const handleSaveProfile = () => {
        updateProfileMutation.mutate({
            firstName,
            lastName,
            gender: gender || undefined,
            companyName,
            telphone,
            website: portfolioLink,
        })
    }

    const handleChangePasswordSubmit = () => {
        if (!currentPassword || !newPassword || !confirmPassword) return
        if (newPassword !== confirmPassword) {
            formToasts.passwordMismatch()
            return
        }
        if (newPassword.length < 8) {
            formToasts.weakPassword()
            return
        }
        changePasswordMutation.mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setCurrentPassword("")
                    setNewPassword("")
                    setConfirmPassword("")
                    setShowChangePassword(false)
                },
            }
        )
    }

    // Support both controlled (open/onOpenChange) and legacy customTrigger mode
    const isControlled = open !== undefined

    return (
        <Dialog open={isControlled ? open : undefined} onOpenChange={isControlled ? onOpenChange : undefined}>
            {!isControlled && customTrigger && (
                <DialogTrigger asChild>
                    {customTrigger}
                </DialogTrigger>
            )}
            <DialogContent noCancel className="sm:max-w-[500px] w-[95vw] flex flex-col items-center max-h-[85vh] overflow-hidden rounded-[20px] p-0 bg-white gap-0 outline-none data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom duration-500">
                <div className="sr-only">
                    <DialogTitle>Creator Settings</DialogTitle>
                    <DialogDescription>Manage your creator profile, inbox and account settings.</DialogDescription>
                </div>

                {/* ── CHANGE PASSWORD sub-view ── */}
                {showChangePassword ? (
                    <div className="flex flex-col w-full h-full">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowChangePassword(false)}
                                className="text-black hover:text-black/70 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <p className="text-[15px] font-medium font-sf-pro-display text-black">Change Password</p>
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="ml-auto h-8 w-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors">
                                    <X className="h-4 w-4 stroke-[2.5px]" />
                                </button>
                            </DialogClose>
                        </div>

                        <div className="flex flex-col flex-1 overflow-y-auto px-6 py-5 gap-3">
                            <div className="relative">
                                <Input
                                    type={showCurrentPw ? "text" : "password"}
                                    placeholder="Current Password"
                                    value={currentPassword}
                                    onChange={(e) => setCurrentPassword(e.target.value)}
                                    className="border-gray-200 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showCurrentPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    type={showNewPw ? "text" : "password"}
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="border-gray-200 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPw(!showNewPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="relative">
                                <Input
                                    type={showConfirmPw ? "text" : "password"}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="border-gray-200 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPw(!showConfirmPw)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                    {showConfirmPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>

                            <div className="mt-auto pt-4">
                                <Button
                                    onClick={handleChangePasswordSubmit}
                                    disabled={
                                        changePasswordMutation.isPending ||
                                        !currentPassword ||
                                        !newPassword ||
                                        !confirmPassword
                                    }
                                    className="w-full bg-deep-red hover:bg-deep-red/80 text-white h-[44px] rounded-[6px] font-medium text-[14px] uppercase tracking-wide disabled:opacity-50">
                                    {changePasswordMutation.isPending ? 'SAVING...' : 'SAVE'}
                                </Button>
                            </div>
                        </div>
                    </div>

                ) : showBankDetails ? (
                    /* ── BANK DETAILS sub-view ── */
                    <div className="flex flex-col w-full h-full">
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 shrink-0">
                            <button
                                type="button"
                                onClick={() => setShowBankDetails(false)}
                                className="text-black hover:text-black/70 transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <p className="text-[15px] font-medium font-sf-pro-display text-black">Bank Details</p>
                            <DialogClose asChild>
                                <button
                                    type="button"
                                    className="ml-auto h-8 w-8 bg-black/5 hover:bg-black/10 rounded-full flex items-center justify-center transition-colors">
                                    <X className="h-4 w-4 stroke-[2.5px]" />
                                </button>
                            </DialogClose>
                        </div>

                        <div className="flex flex-col flex-1 overflow-y-auto px-6 py-5 gap-0">
                            <BankDetailRow label="Payment Method" value="Bank Transfer" />
                            <BankDetailRow label="Currency" value="Naira (₦)" />

                            <p className="text-[13px] font-medium text-black font-sf-pro-display pt-5 pb-3">Account Information</p>

                            <Select>
                                <SelectTrigger className="w-full border-gray-200 text-gray-400 font-normal h-[42px] text-[13px] rounded-[6px] focus:ring-1 focus:ring-gray-400 mb-3">
                                    <SelectValue placeholder="Bank Name" />
                                </SelectTrigger>
                                <SelectContent className="bg-white">
                                    {NIGERIAN_BANKS.map(bank => (
                                        <SelectItem key={bank.code} value={bank.code}>
                                            {bank.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Input placeholder="Account Number" className="border-gray-200 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 mb-3" />
                            <Input placeholder="Account Name" disabled className="border-gray-200 h-[42px] text-[13px] rounded-[6px] bg-gray-50 text-gray-400 cursor-not-allowed" />

                            <div className="mt-auto pt-6">
                                <Button className="w-full bg-deep-red hover:bg-deep-red/80 text-white h-[44px] rounded-[6px] font-medium text-[14px] uppercase tracking-wide">
                                    SAVE
                                </Button>
                            </div>
                        </div>
                    </div>

                ) : (
                    /* ── MAIN TABS view ── */
                    <Tabs defaultValue="profile" className="w-full flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center w-full pt-4 pb-0 shrink-0 border-b border-gray-100 px-6">
                            <TabsList className="bg-transparent gap-6 h-10 p-0 justify-start w-auto">
                                <TabsTrigger
                                    value="profile"
                                    className="border-0 border-b-2 border-transparent data-[state=active]:border-b-[#D32F2F] data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display rounded-none px-0 pb-2 transition-all">
                                    Profile
                                </TabsTrigger>
                                <TabsTrigger
                                    value="inbox"
                                    className="border-0 border-b-2 border-transparent data-[state=active]:border-b-[#D32F2F] data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display rounded-none px-0 pb-2 transition-all">
                                    Inbox
                                </TabsTrigger>
                                <TabsTrigger
                                    value="account"
                                    className="border-0 border-b-2 border-transparent data-[state=active]:border-b-[#D32F2F] data-[state=active]:text-[#D32F2F] data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-medium font-sf-pro-display rounded-none px-0 pb-2 transition-all">
                                    Account
                                </TabsTrigger>
                            </TabsList>

                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 bg-black/5 hover:bg-black/10 rounded-full transition-colors text-black flex items-center justify-center border-0 shadow-none">
                                    <X className="h-4 w-4 stroke-[2.5px]" />
                                </Button>
                            </DialogClose>
                        </div>

                        {/* ── PROFILE TAB ── */}
                        <TabsContent value="profile" className="flex flex-col items-center gap-0 w-full px-6 pt-6 pb-6 overflow-y-auto flex-1">
                            <div className="w-full grid grid-cols-[120px_1fr] gap-y-4 items-center">
                                <Label className="text-gray-500 font-normal text-[13px]">Name</Label>
                                <div className="flex gap-2">
                                    <Input
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        className="border-gray-200 h-[38px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-300"
                                    />
                                    <Input
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        className="border-gray-200 h-[38px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-300"
                                    />
                                </div>

                                <Label className="text-gray-500 font-normal text-[13px]">Gender</Label>
                                <Select value={gender} onValueChange={setGender}>
                                    <SelectTrigger className="w-full border-gray-200 text-gray-600 font-normal h-[38px] text-[13px] rounded-[6px] focus:ring-1 focus:ring-gray-300">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="female">Female</SelectItem>
                                        <SelectItem value="male">Male</SelectItem>
                                        <SelectItem value="other">Other</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Label className="text-gray-500 font-normal text-[13px]">Company Name</Label>
                                <Input
                                    value={companyName}
                                    onChange={(e) => setCompanyName(e.target.value)}
                                    placeholder="Company name"
                                    className="border-gray-200 h-[38px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-300"
                                />

                                <Label className="text-gray-500 font-normal text-[13px]">Email Address</Label>
                                <p className="text-[13px] text-[#007AFF] font-sf-pro-display">{user?.email}</p>

                                <Label className="text-gray-500 font-normal text-[13px] whitespace-nowrap">Phone Number</Label>
                                <Input
                                    value={telphone}
                                    onChange={(e) => setTelphone(e.target.value)}
                                    placeholder="+234..."
                                    className="border-gray-200 h-[38px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-300"
                                />
                            </div>

                            {/* Website row */}
                            <div className="w-full border-t border-gray-100 mt-5">
                                <div
                                    className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50/50 transition-colors"
                                    onClick={() => setIsPortfolioOpen(!isPortfolioOpen)}>
                                    <div className="flex items-center gap-0 w-full">
                                        <span className="text-gray-500 font-normal text-[13px] w-[120px]">Website</span>
                                        <span className="text-gray-400 text-[13px]">{portfolioLink || 'Add Url'}</span>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-black shrink-0" />
                                </div>
                                {isPortfolioOpen && (
                                    <div className="px-0 pb-4 pt-2">
                                        <Input
                                            value={portfolioLink}
                                            onChange={(e) => setPortfolioLink(e.target.value)}
                                            placeholder="https://"
                                            className="h-9 text-[13px] border-gray-200 rounded-[6px]"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Payout Details */}
                            <div className="w-full mt-1">
                                <p className="text-[13px] text-gray-500 font-normal py-3">Payout Details</p>
                                <div className="border-t border-gray-100">
                                    <button
                                        type="button"
                                        onClick={() => setShowBankDetails(true)}
                                        className="text-[13px] text-[#007AFF] font-sf-pro-display py-3 hover:underline text-left">
                                        Add Bank Account
                                    </button>
                                </div>
                            </div>

                            <Button
                                onClick={handleSaveProfile}
                                disabled={updateProfileMutation.isPending}
                                className="w-full bg-deep-red hover:bg-deep-red/80 text-white h-[44px] rounded-[6px] font-medium text-[14px] uppercase tracking-wide mt-4 disabled:opacity-50">
                                {updateProfileMutation.isPending ? 'SAVING...' : 'SAVE'}
                            </Button>
                        </TabsContent>

                        {/* ── INBOX TAB ── */}
                        <TabsContent value="inbox" className="flex flex-col w-full overflow-hidden" style={{ height: '65vh' }}>
                            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 shrink-0">
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setInboxFilter('all')}
                                        className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                                            inboxFilter === 'all'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        All
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setInboxFilter('unread')}
                                        className={`px-3 py-1 rounded-full text-[12px] font-medium transition-colors ${
                                            inboxFilter === 'unread'
                                                ? 'bg-black text-white'
                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}>
                                        {unreadCount > 0 ? `Unread (${unreadCount})` : 'Unread'}
                                    </button>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllRead}
                                        className="text-[12px] text-deep-red font-sf-pro-display hover:underline">
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="flex-1 overflow-y-auto">
                                {groups.length === 0 ? (
                                    <div className="flex items-center justify-center h-full">
                                        <p className="text-[13px] text-gray-400 font-sf-pro-display py-6 uppercase">No notifications</p>
                                    </div>
                                ) : (
                                    groups.map(group => (
                                        <div key={group}>
                                            <p className="text-[11px] text-gray-400 font-sf-pro-display px-5 pt-4 pb-2 uppercase tracking-wider">
                                                {group}
                                            </p>
                                            {visibleNotifications
                                                .filter(n => n.group === group)
                                                .map(notification => (
                                                    <div
                                                        key={notification.id}
                                                        className="flex items-start gap-3 px-5 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                                                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 bg-gray-200">
                                                            <img
                                                                src="/assets/dashboard/store.png"
                                                                alt=""
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <p className="text-[13px] font-medium text-black font-sf-pro-display truncate">
                                                                {notification.subject}
                                                            </p>
                                                            <p className="text-[12px] text-gray-500 font-sf-pro-display truncate">
                                                                {notification.message}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 shrink-0">
                                                            <p className="text-[11px] text-gray-400 font-sf-pro-display">
                                                                {formatMonthDay(notification.createdDate)}
                                                            </p>
                                                            {!notification.viewed && (
                                                                <span className="w-2 h-2 rounded-full bg-deep-red shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        {/* ── ACCOUNT TAB ── */}
                        <TabsContent value="account" className="flex flex-col items-center w-full px-6 pt-6 pb-6 overflow-y-auto flex-1 gap-0">
                            {/* Order Notifications */}
                            <div className="w-full pb-4 border-b border-gray-100">
                                <p className="text-[13px] text-black font-sf-pro-display mb-3">Order Notifications (email)</p>
                                <div className="flex flex-col gap-3">
                                    {[
                                        { value: 'daily', label: 'receive daily order summary' },
                                        { value: 'weekly', label: 'receive weekly order summary' },
                                        { value: 'disabled', label: 'disable all order notifications' },
                                    ].map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setOrderNotification(opt.value as typeof orderNotification)}
                                            className="flex items-center gap-3 text-left">
                                            <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center shrink-0">
                                                {orderNotification === opt.value && (
                                                    <div className="w-2 h-2 rounded-full bg-deep-red" />
                                                )}
                                            </div>
                                            <span className="text-[13px] text-gray-700 font-sf-pro-display">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="w-full flex flex-col gap-0">
                                <AccountSettingItem
                                    label="Password"
                                    value="Change Password"
                                    isAction
                                    onAction={() => setShowChangePassword(true)}
                                />
                                <AccountSettingItem label="Language" value="English" />

                                <div className="flex items-center justify-between py-4 border-b border-gray-100">
                                    <p className="text-[13px] text-gray-600 font-sf-pro-display">Theme</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-1.5 cursor-pointer">
                                            <div className="size-4 rounded-full border border-deep-red flex items-center justify-center">
                                                <div className="size-2 bg-deep-red rounded-full" />
                                            </div>
                                            <span className="text-[13px] text-black">Light</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 cursor-pointer opacity-50">
                                            <div className="size-4 rounded-full border border-gray-300" />
                                            <span className="text-[13px] text-black">Dark</span>
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 py-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 -mx-2 px-2 transition-colors mt-2 text-deep-red">
                                    <LogOut className="size-4" />
                                    <span className="text-[13px] font-medium font-sf-pro-display">Log Out</span>
                                </div>
                            </div>

                            <div className="mt-auto w-full flex justify-center pt-6">
                                <Button
                                    variant="ghost"
                                    className="bg-[#666666] hover:bg-[#555555] text-white hover:text-white text-[12px] h-8 px-4 rounded-[4px] font-medium transition-colors">
                                    Delete Account
                                </Button>
                            </div>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    )
}

function BankDetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <p className="text-[13px] text-gray-500 font-sf-pro-display">{label}</p>
            <p className="text-[13px] text-black font-sf-pro-display">{value}</p>
        </div>
    )
}

function AccountSettingItem({
    label,
    value,
    isAction,
    onAction,
}: {
    label: string
    value: string
    isAction?: boolean
    onAction?: () => void
}) {
    return (
        <div className="flex items-center justify-between py-4 border-b border-gray-100">
            <p className="text-[13px] text-gray-600 font-sf-pro-display">{label}</p>
            {isAction ? (
                <button onClick={onAction} className="text-[13px] text-[#007AFF] hover:underline font-sf-pro-text">{value}</button>
            ) : (
                <p className="text-[13px] text-black font-sf-pro-text">{value}</p>
            )}
        </div>
    )
}
