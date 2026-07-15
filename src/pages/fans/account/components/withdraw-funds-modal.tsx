import BaseModal from "@/components/reusable/base-modal";
import { Button } from "@/components/ui/button";
import { Wallet, CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useVerifyBankAccount, useGetNigerianBanks } from "@/hooks/use-payments";
import { NigerianBanksResponse, NigerianBankResolve } from "@/types/payments";
import { useWithdrawFunds } from "@/hooks/use-profile-mutations";
import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WithdrawFundsModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
}

type VerifyStatus = "idle" | "loading" | "verified" | "error";

const DEBOUNCE_MS = 400;
const ACCOUNT_NUMBER_LENGTH = 10;

export function WithdrawFundsModal({
  isOpen,
  onClose,
  availableBalance,
}: WithdrawFundsModalProps) {
  const [amount, setAmount] = useState("");
  const [selectedBankCode, setSelectedBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>("idle");
  const [accountName, setAccountName] = useState("");
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { mutate: fetchBanks, data: banksResponse } = useGetNigerianBanks();
  const { mutateAsync: verifyBankAccount } = useVerifyBankAccount();
    const { mutate: withdrawFunds } = useWithdrawFunds();

  const banks = (banksResponse?.data as NigerianBanksResponse[] | undefined) ?? [];

  useEffect(() => {
    if (isOpen) fetchBanks();
  }, [isOpen, fetchBanks]);

  function resetVerify() {
    setVerifyStatus("idle");
    setAccountName("");
  }

  function triggerVerify(accNum: string, bankCode: string) {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (accNum.length !== ACCOUNT_NUMBER_LENGTH || !bankCode) return;

    debounceRef.current = setTimeout(() => {
      verifyAccount(accNum, bankCode);
    }, DEBOUNCE_MS);
  }

  function handleAccountNumberChange(value: string) {
    setAccountNumber(value);
    resetVerify();
    triggerVerify(value, selectedBankCode);
  }

  function handleBankChange(code: string) {
    setSelectedBankCode(code);
    resetVerify();
    triggerVerify(accountNumber, code);
  }

  async function verifyAccount(accNum: string, bankCode: string) {
    setVerifyStatus("loading");
    try {
      const res = await verifyBankAccount({ accountNumber: accNum, bankCode });
      const resolved = res.data as NigerianBankResolve;
      console.log(resolved)
      setAccountName(resolved.accountName);
      setVerifyStatus("verified");
    } catch {
      setVerifyStatus("error");
    }
  }

  function handleClose() {
    setAmount("");
    setSelectedBankCode("");
    setAccountNumber("");
    resetVerify();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onClose();
  }

  const handleConfirm = () => {
    withdrawFunds({
      accountNumber,
      bankCode: selectedBankCode,
      amount: Number(amount),
      accountName,
    });
    handleClose();
  };

  const canConfirm =
    !!amount &&
    Number(amount) > 0 &&
    Number(amount) <= availableBalance &&
    verifyStatus === "verified";

  return (
    <BaseModal
      open={isOpen}
      onClose={handleClose}
      size="small"
      titleClassName="font-inter text-sm px-0"
      title="Withdraw Funds"
      className="bg-[#1A1A1A] border border-white/10"
    >
      <div className="w-full flex flex-col gap-6 p-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="border-b border-white/10" />
        </div>

        {/* Available Balance */}
        <div className="bg-[#262626] px-3 py-2 rounded-md flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-light-red" />
            <p className="text-[#8E8E93] text-sm font-sf-pro-display">
              Available Balance
            </p>
          </div>
          <p className="text-white text-base md:text-lg font-inter font-semibold">
            ₦{availableBalance.toLocaleString()}
          </p>
        </div>

        {/* Payout Method */}
        <div className="flex flex-col gap-3">
          <p className="font-inter text-sm text-white">Payout Method</p>

          {/* Bank Select */}
          <select
            value={selectedBankCode}
            onChange={(e) => handleBankChange(e.target.value)}
            className="w-full h-11 pr-2 bg-transparent border border-white rounded-lg px-3 mb-2 text-sm font-inter font-semibold text-white focus:outline-none focus:border-white/40 [&>option]:bg-[#1A1A1A] [&>option]:text-white"
          >
            <option value="" disabled>Select bank</option>
            {banks.map((bank) => (
              <option key={bank.slug} value={bank.code}>
                {bank.name}
              </option>
            ))}
          </select>

          {/* Account Number */}
          <div className="flex flex-col gap-1">
            <div className="relative">
              <Input
                type="text"
                inputMode="numeric"
                maxLength={ACCOUNT_NUMBER_LENGTH}
                placeholder="Account Number"
                value={accountNumber}
                onChange={(e) => handleAccountNumberChange(e.target.value.replace(/\D/g, ""))}
                className={cn(
                  "w-full h-11 bg-transparent border rounded-lg px-4 pr-10 text-white text-sm font-inter placeholder:text-white/40 placeholder:font-inter font-semibold focus:outline-none transition-colors",
                  verifyStatus === "verified" && "border-green-500 focus:border-green-500",
                  verifyStatus === "error" && "border-red-400 focus:border-red-500",
                  verifyStatus === "idle" || verifyStatus === "loading"
                    ? "border-white "
                    : "",
                )}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {verifyStatus === "loading" && (
                  <Loader2 size={14} className="animate-spin text-white/40" />
                )}
                {verifyStatus === "verified" && (
                  <CheckCircle2 size={14} className="text-green-500" />
                )}
              </div>
            </div>

            {verifyStatus === "verified" && accountName && (
              <p className="text-xs text-green-500 font-inter font-medium">{accountName}</p>
            )}
            {verifyStatus === "error" && (
              <p className="text-xs text-red-400 font-inter">Account not found</p>
            )}
          </div>
        </div>

        <p className="font-inter text-sm text-white font-semibold">
            Amount
        </p>

        {/* Amount Input */}
        <div className="flex flex-col gap-2">
          <Input
            type="number"
            placeholder="₦ 0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full h-14 bg-transparent border border-white/20 rounded-lg px-4 font-medium text-white text-lg font-sf-pro-display placeholder:text-white/40 focus:border-white/40"
          />
        </div>

        {/* Confirm Button */}
        <Button
          onClick={handleConfirm}
          disabled={!canConfirm}
          className="w-full h-12 bg-white hover:bg-white/90 text-deep-red font-inter font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Withdraw
        </Button>
      </div>
    </BaseModal>
  );
}
