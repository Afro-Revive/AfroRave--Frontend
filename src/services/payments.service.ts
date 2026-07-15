import { NigerianBankResolveResponse, NigerianBanksListResponse } from "@/types/payments";
import api from "./http.service";

class PaymentService {
    /**
     * Verify Bank Account Number and Bank Code
     */

    async verifyBankAccount(accountNumber: string, bankCode: string): Promise<NigerianBankResolveResponse> {
        const response = await api.get('/api/Payment/bank/resolve', {
            params: { accountNumber, bankCode },
        });
        console.log('Verify Bank Account Response:', response.data); // Log the response data for debugging
        return response.data;
    }

    /**
     * Get List of Nigerian Banks
     */
    async getNigerianBanks(): Promise<NigerianBanksListResponse> {
        const country = "nigeria";
        const response = await api.get('/api/Payment/banks', {
            params: { country },
        });
        return response.data;
    }
}

export const paymentService = new PaymentService();