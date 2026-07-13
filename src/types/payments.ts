import { ApiResponse } from "./api";

export interface NigerianBanksResponse {
    name: string;
    code: string;
    slug: string;
    active: string;
}

export type NigerianBanksListResponse = ApiResponse<NigerianBanksResponse[]>;

export interface NigerianBankResolve {
    account_number: string;
    account_name: string;
    bank_id: number;
}

export type NigerianBankResolveResponse = ApiResponse<NigerianBankResolve>;