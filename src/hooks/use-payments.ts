import { paymentService } from "@/services/payments.service";
import { useMutation } from "@tanstack/react-query";


export function useVerifyBankAccount() {
    return useMutation({
        mutationKey: ['verify-bank-account'],
        mutationFn: async ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) => {
            return await paymentService.verifyBankAccount(accountNumber, bankCode);
        },
    })
}

export function useGetNigerianBanks() {
    return useMutation({
        mutationKey: ['get-nigerian-banks'],
        mutationFn: async () => {
            return await paymentService.getNigerianBanks();
        },
    })
}