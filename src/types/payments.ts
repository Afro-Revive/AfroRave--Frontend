import { ApiResponse } from "./api";

export interface NigerianBanksResponse {
    name: string;
    code: string;
    slug: string;
    active: string;
}

export type NigerianBanksListResponse = ApiResponse<NigerianBanksResponse[]>;

export interface NigerianBankResolve {
    accountNumber: string;
    accountName: string;
    bankId: number;
}

export type NigerianBankResolveResponse = ApiResponse<NigerianBankResolve>;