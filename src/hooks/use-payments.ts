import { paymentService } from "@/services/payments.service";
import { useMutation, useQuery } from "@tanstack/react-query";


export function useVerifyBankAccount() {
    return useMutation({
        mutationKey: ['verify-bank-account'],
        mutationFn: async ({ accountNumber, bankCode }: { accountNumber: string; bankCode: string }) => {
            return await paymentService.verifyBankAccount(accountNumber, bankCode);
        },
    })
}

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * The list of Nigerian banks, cached. It used to be a mutation, whose result
 * isn't cached: it lived only in the component that ran it.
 * `enabled` lets a caller wait (e.g. until
 * its modal opens).
 */
export function useGetNigerianBanks(options?: { enabled?: boolean }) {
    return useQuery({
        queryKey: ['nigerian-banks'],
        queryFn: () => paymentService.getNigerianBanks(),
        // The list repeats some bank codes (seen on dev: 50572, 100025), which
        // showed those banks twice and broke the list's keys. One per code.
        select: (response) => {
            const banks = response?.data
            if (!Array.isArray(banks)) return response
            const seen = new Set<string>()
            return {
                ...response,
                data: banks.filter((bank: { code: string }) => !seen.has(bank.code) && seen.add(bank.code)),
            }
        },
        staleTime: DAY_MS,
        gcTime: DAY_MS,
        enabled: options?.enabled ?? true,
    })
}