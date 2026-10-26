import { BaseSelect } from "@/components/reusable/base-select"
import { Pagination } from "@/components/shared/pagination"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useGetNigerianBanks, useVerifyBankAccount } from "@/hooks/use-payments"
import {
    useOrganizerBankAccount,
    useOrganizerEarlyPayout,
    useOrganizerPayoutHistory,
    useOrganizerWallet,
    useSaveOrganizerBankAccount,
} from "@/hooks/use-profile-mutations"
import { formatNaira } from "@/lib/format-price"
import { formatShortDate } from "@/lib/helper-func"
import { cn } from "@/lib/utils"
import type { PaginatedResponse } from "@/types/api"
import type { NigerianBankResolve, NigerianBanksResponse } from "@/types/payments"
import type { BankDetailsRequest, OrganizerWalletData, PayoutHistoryData } from "@/types/profile"
import { useEffect, useRef, useState } from "react"
import { RiInformationLine, RiLoader4Line, RiWallet3Line } from "react-icons/ri"
import {
    DARK_SELECT_CONTENT_CLASS,
    DARK_SELECT_ITEM_CLASS,
    INSET_INPUT_CLASS,
    INSET_SELECT_CLASS,
    SELECT_OPEN_STEADY_CLASS,
} from "./settings-field-classes"
import { InsetField } from "./settings-inset-field"

const HISTORY_PAGE_SIZE = 5
const VERIFY_DEBOUNCE_MS = 400

type VerifyStatus = "idle" | "loading" | "verified" | "error"

/**
 * The organizer settings modal's Payout tab: total revenue, where payouts go
 * (the bank account, checked with the bank before saving), an early payout on
 * request, and the payout history.
 */
export function CreatorPayoutTab() {
    const { data: walletResponse, isPending: isWalletLoading } = useOrganizerWallet()
    const wallet = walletResponse?.data as OrganizerWalletData | undefined

    const { data: bankResponse, isPending: isBankLoading } = useOrganizerBankAccount()
    const savedAccount = bankResponse?.data as BankDetailsRequest | null | undefined
    const hasBankAccount = !!savedAccount?.accountNumber

    // What can be paid out now; the wallet names it a few ways.
    const available = wallet?.amountInWallet ?? wallet?.walletBalance ?? wallet?.balance ?? 0
    const [isEarlyPayoutOpen, setIsEarlyPayoutOpen] = useState(false)
    const canRequestEarlyPayout = hasBankAccount && available > 0

    return (
        <div className="flex flex-col w-full">
            <h3 className="text-xl font-bold text-black font-inter">Payout Details</h3>
            <p className="mt-1 text-[13px] text-gray-500 font-inter">
                Manage where your ticket and vendor-slot earnings are paid.
            </p>

            {/* Total revenue, and a nudge while there's nowhere to pay it. */}
            <div className="mt-3 rounded-2xl border border-[#D9D9D9] bg-white p-4 text-black">
                <p className="flex items-center gap-2 text-sm font-semibold text-gray-500 font-inter">
                    <RiWallet3Line className="size-5 text-deep-red" aria-hidden />
                    Total Revenue
                </p>
                {isWalletLoading ? (
                    <span className="mt-3 block h-8 w-40 rounded bg-black/10 animate-pulse" />
                ) : (
                    <p className="mt-2 text-3xl font-bold font-inter">{formatNaira(wallet?.totalRevenue ?? 0)}</p>
                )}

                {/* A darker amber than on dark, so it still reads on white. */}
                {!isBankLoading && !hasBankAccount && (
                    <p className="mt-3 flex items-start gap-2 border-t border-gray-200 pt-3 text-[13px] text-[#B7791F] font-inter">
                        <RiInformationLine className="size-5 shrink-0" aria-hidden />
                        No bank account yet. Add one below to enable Auto payout on the next payout date.
                    </p>
                )}
            </div>

            <InfoNote className="mt-3">
                Payouts are sent automatically on your payout date, need funds sooner?{" "}
                <button
                    type="button"
                    onClick={() => setIsEarlyPayoutOpen(true)}
                    disabled={!canRequestEarlyPayout}
                    title={
                        !hasBankAccount
                            ? "Add a bank account first"
                            : available <= 0
                              ? "There's nothing to pay out yet"
                              : undefined
                    }
                    className="block text-deep-red underline underline-offset-2 hover:text-deep-red/80 disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline">
                    Request an early payout
                </button>
            </InfoNote>

            <BankAccountForm savedAccount={hasBankAccount ? savedAccount! : undefined} />

            <PayoutHistory />

            {hasBankAccount && (
                <EarlyPayoutDialog
                    open={isEarlyPayoutOpen}
                    onOpenChange={setIsEarlyPayoutOpen}
                    available={available}
                    account={savedAccount!}
                />
            )}
        </div>
    )
}

/**
 * Choose a bank, type the account number, and the account name fills in from
 * the bank. Save is only possible once the bank has confirmed the account.
 */
function BankAccountForm({ savedAccount }: { savedAccount?: BankDetailsRequest }) {
    const { data: banksResponse } = useGetNigerianBanks()
    const { mutateAsync: verifyBankAccount } = useVerifyBankAccount()
    const saveBankAccount = useSaveOrganizerBankAccount()
    const banks = (banksResponse?.data as NigerianBanksResponse[] | undefined) ?? []

    const [bankCode, setBankCode] = useState("")
    const [accountNumber, setAccountNumber] = useState("")
    const [accountName, setAccountName] = useState("")
    const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle")
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    // Each check is numbered, so a slow answer for an old number can't win.
    const checkIdRef = useRef(0)

    // Show the saved account, already confirmed, once it loads.
    useEffect(() => {
        if (!savedAccount) return
        setBankCode(savedAccount.bankCode)
        setAccountNumber(savedAccount.accountNumber)
        setAccountName(savedAccount.accountName)
        setVerifyStatus("verified")
    }, [savedAccount])

    useEffect(() => () => {
        if (debounceRef.current) clearTimeout(debounceRef.current)
    }, [])

    function check(nextBankCode: string, nextAccountNumber: string) {
        if (debounceRef.current) clearTimeout(debounceRef.current)
        setAccountName("")
        // Nigerian account numbers (NUBAN) are 10 digits.
        if (!nextBankCode || nextAccountNumber.length !== 10) {
            setVerifyStatus("idle")
            return
        }

        setVerifyStatus("loading")
        const checkId = ++checkIdRef.current
        debounceRef.current = setTimeout(async () => {
            try {
                const response = await verifyBankAccount({
                    accountNumber: nextAccountNumber,
                    bankCode: nextBankCode,
                })
                if (checkId !== checkIdRef.current) return
                const resolved = response.data as NigerianBankResolve | undefined
                if (!resolved?.accountName) throw new Error("No account name")
                setAccountName(resolved.accountName)
                setVerifyStatus("verified")
            } catch {
                if (checkId !== checkIdRef.current) return
                setVerifyStatus("error")
            }
        }, VERIFY_DEBOUNCE_MS)
    }

    const isUnchanged =
        !!savedAccount &&
        savedAccount.bankCode === bankCode &&
        savedAccount.accountNumber === accountNumber
    const canSave = verifyStatus === "verified" && !isUnchanged && !saveBankAccount.isPending

    function handleSave() {
        if (!canSave) return
        saveBankAccount.mutate({
            bankName: banks.find((bank) => bank.code === bankCode)?.name ?? "",
            bankCode,
            accountNumber,
            accountName,
        })
    }

    const isError = verifyStatus === "error"

    return (
        <div className="mt-6 flex flex-col">
            <h4 className="text-base font-bold text-black font-inter">Bank Account</h4>
            <p className="mt-1 text-[13px] text-gray-500 font-inter">
                Choose your bank and enter your account number. We'll check the account name with your bank before saving.
            </p>

            <div className="mt-3 flex flex-col gap-3">
                <InsetField label="Bank">
                    <BaseSelect
                        placeholder="Select Your Bank"
                        value={bankCode}
                        onChange={(code) => {
                            setBankCode(code)
                            check(code, accountNumber)
                        }}
                        items={banks.map((bank) => ({ value: bank.code, label: bank.name }))}
                        triggerClassName={cn(INSET_SELECT_CLASS, SELECT_OPEN_STEADY_CLASS)}
                        contentClassName={DARK_SELECT_CONTENT_CLASS}
                        itemClassName={DARK_SELECT_ITEM_CLASS}
                    />
                </InsetField>

                <div className="flex flex-col gap-1">
                    <div className="relative w-full">
                        <label
                            htmlFor="payout-account-number"
                            className={cn(
                                "absolute left-4 top-[10px] z-10 pointer-events-none text-[10px] font-sf-pro-display uppercase tracking-widest",
                                isError ? "text-deep-red" : "text-mid-dark-gray",
                            )}>
                            Account Number
                        </label>
                        <Input
                            id="payout-account-number"
                            inputMode="numeric"
                            maxLength={10}
                            value={accountNumber}
                            onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 10)
                                setAccountNumber(digits)
                                check(bankCode, digits)
                            }}
                            aria-invalid={isError}
                            className={cn(INSET_INPUT_CLASS, "pr-10", isError && "border-deep-red focus:border-deep-red")}
                        />
                        {verifyStatus === "loading" && (
                            <RiLoader4Line
                                className="absolute right-4 top-1/2 size-4 -translate-y-1/2 animate-spin text-gray-400"
                                aria-label="Checking account"
                            />
                        )}
                    </div>
                    {isError && (
                        <p role="alert" className="text-[13px] text-deep-red font-inter">
                            We couldn't find this account.
                        </p>
                    )}
                </div>

                {/* Filled in by the bank, never typed; only there once the bank has named the account. */}
                {accountName && (
                    <div
                        aria-live="polite"
                        className="flex h-[44px] items-center rounded-[6px] bg-[#4A4A4A] px-4 text-sm font-semibold text-white font-inter">
                        {accountName}
                    </div>
                )}

                <InfoNote>Only Nigerian bank accounts (NGN) are supported.</InfoNote>

                <Button
                    type="button"
                    onClick={handleSave}
                    disabled={!canSave}
                    className="h-[44px] w-full rounded-[6px] bg-[#1E1E1E] font-inter-tight text-[14px] font-semibold text-white hover:bg-black disabled:bg-[#6B6B6B] disabled:opacity-100">
                    {saveBankAccount.isPending ? "Saving..." : isUnchanged ? "Saved" : "Save"}
                </Button>
            </div>
        </div>
    )
}

/** Payouts and withdrawals so far, newest first, paged by the server. */
function PayoutHistory() {
    const [page, setPage] = useState(1)
    const { data, isPending, isFetching, isError } = useOrganizerPayoutHistory({
        pageNumber: page,
        pageSize: HISTORY_PAGE_SIZE,
    })
    const history = data?.data as PaginatedResponse<PayoutHistoryData> | PayoutHistoryData[] | undefined
    const items = Array.isArray(history) ? history : (history?.items ?? [])
    const paged = Array.isArray(history) ? undefined : history

    return (
        <div className="mt-6 flex flex-col">
            <h4 className="text-base font-bold text-black font-inter">Payout History</h4>

            {isPending ? (
                <div className="mt-3 flex justify-center rounded-xl border border-gray-200 py-8">
                    <RiLoader4Line className="size-5 animate-spin text-deep-red" aria-label="Loading payouts" />
                </div>
            ) : isError ? (
                <div className="mt-3 rounded-xl border border-gray-200 py-8 text-center text-[13px] text-gray-500 font-inter">
                    Couldn't load your payouts. Please try again.
                </div>
            ) : items.length === 0 ? (
                <div className="mt-3 flex flex-col items-center gap-1 rounded-xl border border-gray-300 py-6 text-center font-inter">
                    <p className="text-sm font-bold text-gray-500">No Payouts Yet</p>
                    <p className="text-[13px] text-gray-500">Your payouts will show here once your first one is sent.</p>
                </div>
            ) : (
                <>
                    <ul className="mt-3 flex flex-col divide-y divide-gray-100 rounded-xl border border-gray-200">
                        {items.map((payout) => (
                            <li key={payout.id} className="flex items-center justify-between gap-3 px-4 py-3 font-inter">
                                <div className="flex min-w-0 flex-col">
                                    <p className="truncate text-[13px] font-medium text-black">
                                        {payout.description || payout.eventName || payout.transactionType}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatShortDate(payout.createdDate)}
                                        {payout.accountNumber && ` · to •••${payout.accountNumber.slice(-4)}`}
                                    </p>
                                </div>
                                <div className="flex shrink-0 flex-col items-end gap-1">
                                    <p className="text-sm font-bold text-black">{formatNaira(payout.amount)}</p>
                                    <PayoutStatus status={payout.status} />
                                </div>
                            </li>
                        ))}
                    </ul>
                    {paged && paged.totalPages > 1 && (
                        <Pagination
                            page={paged.pageNumber ?? page}
                            totalPages={paged.totalPages}
                            totalCount={paged.totalCount}
                            onPageChange={setPage}
                            itemLabel={{ one: "payout", other: "payouts" }}
                            isLoading={isFetching}
                            className="mt-3"
                        />
                    )}
                </>
            )}
        </div>
    )
}

function PayoutStatus({ status }: { status: string }) {
    const value = status?.toLowerCase() ?? ""
    const tone =
        value.includes("success") || value.includes("complete") || value.includes("paid")
            ? "bg-green/10 text-green"
            : value.includes("fail") || value.includes("reject") || value.includes("cancel")
              ? "bg-deep-red/10 text-deep-red"
              : "bg-[#F5A623]/15 text-[#B7791F]"

    return (
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize", tone)}>
            {status || "Pending"}
        </span>
    )
}

/**
 * Pays out an amount the organizer chooses, up to what's available, to their
 * saved bank account, before the payout date.
 */
function EarlyPayoutDialog({
    open,
    onOpenChange,
    available,
    account,
}: {
    open: boolean
    onOpenChange: (open: boolean) => void
    available: number
    account: BankDetailsRequest
}) {
    const earlyPayout = useOrganizerEarlyPayout()
    const [amount, setAmount] = useState("")

    const value = Number(amount.replace(/,/g, ""))
    const error =
        amount === ""
            ? null
            : !Number.isFinite(value) || value <= 0
              ? "Enter an amount above ₦0."
              : value > available
                ? `You can pay out up to ${formatNaira(available)}.`
                : null
    const canSubmit = amount !== "" && !error && !earlyPayout.isPending

    function close(next: boolean) {
        if (!next) setAmount("")
        onOpenChange(next)
    }

    function handleSubmit() {
        if (!canSubmit) return
        earlyPayout.mutate(
            {
                amount: value,
                accountNumber: account.accountNumber,
                bankCode: account.bankCode,
                accountName: account.accountName,
            },
            { onSuccess: () => close(false) },
        )
    }

    return (
        <Dialog open={open} onOpenChange={close}>
            <DialogContent className="sm:max-w-[400px] rounded-[16px] bg-white p-6">
                <DialogTitle className="text-lg font-bold text-black font-inter">Request an early payout</DialogTitle>
                <DialogDescription className="text-[13px] text-gray-500 font-inter">
                    {formatNaira(available)} is available to pay out now.
                </DialogDescription>

                <div className="mt-2 flex flex-col gap-1">
                    <InsetField label="Amount (₦)">
                        <Input
                            inputMode="decimal"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value.replace(/[^\d.,]/g, ""))}
                            aria-invalid={!!error}
                            className={cn(INSET_INPUT_CLASS, error && "border-deep-red focus:border-deep-red")}
                        />
                    </InsetField>
                    {error && <p role="alert" className="text-[13px] text-deep-red font-inter">{error}</p>}
                    <button
                        type="button"
                        onClick={() => setAmount(String(available))}
                        className="self-end text-xs text-deep-red underline underline-offset-2">
                        Pay out everything
                    </button>
                </div>

                <InfoNote className="mt-2">
                    To {account.bankName || "your bank"} •••{account.accountNumber.slice(-4)}, {account.accountName}
                </InfoNote>

                <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="mt-3 h-[44px] w-full rounded-[6px] bg-deep-red text-[14px] font-medium text-white hover:bg-deep-red/80 disabled:opacity-50">
                    {earlyPayout.isPending ? "Requesting..." : "Request Payout"}
                </Button>
            </DialogContent>
        </Dialog>
    )
}

function InfoNote({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn("flex items-start gap-2 rounded-lg bg-[#F2F2F2] px-3 py-3 text-[13px] text-black font-inter", className)}>
            <RiInformationLine className="size-5 shrink-0 text-black" aria-hidden />
            <div>{children}</div>
        </div>
    )
}
