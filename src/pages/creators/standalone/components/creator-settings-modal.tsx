import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogClose,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FormBase, FormField } from "@/components/reusable/base-form"
import { ChangePasswordSchema, type ChangePasswordValues } from "@/pages/fans/settings/zod-schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
// import { useOrganizerNotifications } from "@/hooks/use-profile-mutations"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronLeft, Eye, EyeOff, LogOut, X } from "lucide-react"
import { useGetNigerianBanks } from "@/hooks/use-payments"
import { useEffect, useState } from "react"
// import { formatMonthDay, relativeDateGroup } from "@/lib/helper-func"
import { useLogout } from '@/hooks/use-auth'
import { useChangeOrganizerPassword } from '@/hooks/use-profile-mutations'
// import type { PaginatedResponse } from "@/types/api"
import { NigerianBanksResponse } from "@/types/payments"
import { CreatorAccountTab } from "./creator-account-tab"

interface CreatorSettingsModalProps {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    /** @deprecated use open/onOpenChange instead */
    customTrigger?: React.ReactNode
}


export function CreatorSettingsModal({ open, onOpenChange, customTrigger }: CreatorSettingsModalProps) {
    const logoutMutation = useLogout()
    const changePasswordMutation = useChangeOrganizerPassword()

    // Sub-view. Nothing opens it while the Payout tab is empty; it's kept for
    // when payouts are built.
    const [showBankDetails, setShowBankDetails] = useState(false)

    // Bank details
    const {mutate: fetchBanks, data: banksData } = useGetNigerianBanks()
    const NIGERIAN_BANKS = banksData?.data as NigerianBanksResponse[] | undefined || []

    // Inbox
    // const [inboxFilter, setInboxFilter] = useState<'all' | 'unread'>('all')
    // const { data: notificationsData } = useOrganizerNotifications()
    // console.log(notificationsData)
    // const markAsReadMutation = useMarkNotificationAsRead()
    // const [locallyRead, setLocallyRead] = useState<string[]>([])

    // // Memoize notifications with viewed status (local or remote) and group.
    // const notifications = useMemo(() => {
    //     const payload = notificationsData?.data
    //     const items = Array.isArray(payload)
    //         ? (payload as NotificationData[])
    //         : ((payload as PaginatedResponse<NotificationData> | undefined)?.items ?? [])
    //     return items.map((n) => ({
    //         ...n,
    //         viewed: n.viewed || locallyRead.includes(n.id),
    //         group: relativeDateGroup(n.createdDate),
    //     }))
    // }, [notificationsData, locallyRead])

    // Not saved anywhere yet: there's no endpoint for it.
    const [emailNotifications, setEmailNotifications] = useState(true)

    // Change password (Settings tab): the same schema as the fans settings page.
    const passwordForm = useForm<ChangePasswordValues>({
        resolver: zodResolver(ChangePasswordSchema),
        defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    })
    // Show/hide is display only, so it stays plain state.
    const [showCurrentPw, setShowCurrentPw] = useState(false)
    const [showNewPw, setShowNewPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)

    // The bank list, for the bank details screen.
    useEffect(() => {
        fetchBanks()
    }, [fetchBanks])

    // const unreadCount = notifications.filter(n => !n.viewed).length
    // const visibleNotifications = inboxFilter === 'unread'
    //     ? notifications.filter(n => !n.viewed)
    //     : notifications

    // const groups = Array.from(new Set(visibleNotifications.map(n => n.group)))

    // const handleMarkAllRead = () => {
    //     const unread = notifications.filter(n => !n.viewed)
    //     // Clear the dots straight away, then persist each one.
    //     setLocallyRead(prev => [...prev, ...unread.map(n => n.id)])
    //     unread.forEach(n => markAsReadMutation.mutate(n.id))
    // }

    const handleLogout = () => {
        logoutMutation.mutate()
    }

    const handleChangePassword = (values: ChangePasswordValues) => {
        changePasswordMutation.mutate(
            {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
                confirmNewPassword: values.confirmPassword,
            },
            { onSuccess: () => passwordForm.reset() },
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
                    <DialogDescription>Manage your account details, payouts and settings.</DialogDescription>
                </div>

                {showBankDetails ? (
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
                    <Tabs defaultValue="account" className="w-full flex flex-col overflow-hidden">
                        <div className="flex justify-between items-center w-full pt-4 pb-2 shrink-0 border-b border-gray-300 px-6">
                            <TabsList className="bg-transparent gap-6 h-10 p-0 justify-start w-auto">
                                <TabsTrigger value="account" className={TAB_TRIGGER_CLASS}>
                                    Account
                                </TabsTrigger>
                                <TabsTrigger value="payout" className={TAB_TRIGGER_CLASS}>
                                    Payout
                                </TabsTrigger>
                                {/* <TabsTrigger value="inbox" className={TAB_TRIGGER_CLASS}>
                                    Inbox
                                </TabsTrigger> */}
                                <TabsTrigger value="settings" className={TAB_TRIGGER_CLASS}>
                                    Settings
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

                        {/* ── ACCOUNT TAB: its own component, since it's the biggest ── */}
                        <TabsContent value="account" className="flex flex-col w-full px-6 pb-6 overflow-y-auto flex-1">
                            <CreatorAccountTab />
                        </TabsContent>

                        {/* ── PAYOUT TAB: empty until payouts are built ── */}
                        <TabsContent value="payout" className="flex flex-col items-center justify-center w-full px-6 py-16 flex-1">
                            <p className="text-[13px] text-gray-400 font-sf-pro-display text-center">
                                Payout details will appear here.
                            </p>
                        </TabsContent>

                        {/* ── INBOX TAB ── */}
                        {/* <TabsContent value="inbox" className="flex flex-col w-full overflow-hidden" style={{ height: '65vh' }}>
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
                        </TabsContent> */}

                        {/* ── SETTINGS TAB: password, email notifications, log out ── */}
                        <TabsContent value="settings" className="flex flex-col items-center w-full px-6 pt-6 pb-6 overflow-y-auto flex-1 gap-0">
                            {/* Change Password */}
                            <div className="w-full flex flex-col gap-3 pb-5 border-b border-gray-100">
                                <p className="text-[13px] text-black font-sf-pro-display">Change Password</p>

                                <FormBase
                                    form={passwordForm}
                                    onSubmit={handleChangePassword}
                                    className="w-full flex flex-col gap-3">
                                    <FormField form={passwordForm} name="currentPassword" className="w-full">
                                        {(field) => (
                                            <PasswordInput
                                                placeholder="Current Password"
                                                value={field.value as string}
                                                onChange={field.onChange}
                                                isVisible={showCurrentPw}
                                                onToggleVisible={() => setShowCurrentPw(!showCurrentPw)}
                                            />
                                        )}
                                    </FormField>
                                    <FormField form={passwordForm} name="newPassword" className="w-full">
                                        {(field) => (
                                            <PasswordInput
                                                placeholder="New Password"
                                                value={field.value as string}
                                                onChange={field.onChange}
                                                isVisible={showNewPw}
                                                onToggleVisible={() => setShowNewPw(!showNewPw)}
                                            />
                                        )}
                                    </FormField>
                                    <FormField form={passwordForm} name="confirmPassword" className="w-full">
                                        {(field) => (
                                            <PasswordInput
                                                placeholder="Confirm New Password"
                                                value={field.value as string}
                                                onChange={field.onChange}
                                                isVisible={showConfirmPw}
                                                onToggleVisible={() => setShowConfirmPw(!showConfirmPw)}
                                            />
                                        )}
                                    </FormField>

                                    <Button
                                        type="submit"
                                        disabled={changePasswordMutation.isPending}
                                        className="w-full bg-black hover:bg-black/80 font-inter-tight text-white h-[44px] rounded-[6px] font-semibold text-sm tracking-wide disabled:opacity-50">
                                        {changePasswordMutation.isPending ? 'Saving...' : 'Update Password'}
                                    </Button>
                                </FormBase>
                            </div>

                            {/* Email Notifications: one on/off, the whole row toggles it. */}
                            <label
                                htmlFor="email-notifications"
                                className="w-full flex items-start justify-between gap-4 py-5 border-b border-gray-100 cursor-pointer">
                                <span className="flex flex-col gap-1">
                                    <span className="text-[13px] text-gray-600 font-inter-tight">Email Notifications</span>
                                    <span className="text-[13px] text-gray-500 font-inter-tight">
                                        Receive Updates About Your Tickets And Trending Events
                                    </span>
                                </span>
                                <Checkbox
                                    id="email-notifications"
                                    checked={emailNotifications}
                                    onCheckedChange={(checked) => setEmailNotifications(checked === true)}
                                    className="mt-0.5 data-[state=checked]:bg-deep-red data-[state=checked]:border-deep-red"
                                />
                            </label>

                            {/* Log Out */}
                            <button
                                type="button"
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                                className="w-full flex items-center gap-2 py-4 border-b border-gray-100 hover:bg-gray-50 -mx-2 px-2 transition-colors text-deep-red disabled:opacity-50">
                                <LogOut className="size-4" />
                                <span className="text-[13px] font-medium font-sf-pro-display">
                                    {logoutMutation.isPending ? 'Logging out...' : 'Log Out'}
                                </span>
                            </button>
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
            <p className="text-[13px] text-gray-500 font-inter-tight">{label}</p>
            <p className="text-[13px] text-black font-inter-tight">{value}</p>
        </div>
    )
}

const TAB_TRIGGER_CLASS = "border-0 border-b-2 border-transparent data-[state=active]:text-black data-[state=active]:shadow-none data-[state=active]:bg-transparent text-gray-500 hover:text-gray-800 text-[14px] font-semibold font-inter-tight rounded-none px-0 pb-2 transition-all"

/** A password field with a show/hide toggle. */
function PasswordInput({
    placeholder,
    value,
    onChange,
    isVisible,
    onToggleVisible,
}: {
    placeholder: string
    value: string
    onChange: (value: string) => void
    isVisible: boolean
    onToggleVisible: () => void
}) {
    return (
        // w-full: FormField lines its field up with items-start, which would
        // otherwise shrink the box to its content.
        <div className="relative w-full">
            <Input
                type={isVisible ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="border-gray-200 h-[42px] text-[13px] rounded-[6px] focus-visible:ring-1 focus-visible:ring-gray-400 pr-10"
            />
            <button
                type="button"
                onClick={onToggleVisible}
                aria-label={isVisible ? `Hide ${placeholder.toLowerCase()}` : `Show ${placeholder.toLowerCase()}`}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
        </div>
    )
}
