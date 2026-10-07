import { ApiResponse } from "./api";

export interface GuestListData {   
    id: string
    name: string
    email: string
    createdDate: string
    categoryIds: string[]
    categoryNames: string[]
}

export interface CreateGuestRequest {
    name: string
    email: string
    categoryId?: string
}

export interface CategoryData {
    id: string
    name: string
    guestCount: number
    createdDate: string
}

export interface EventGuestlistCongigData {
    categoryIds: string[]
    individualGuestIds: string[]
}


export type CategoryResponse = ApiResponse<CategoryData[]>
export type GuestListResponse = ApiResponse<GuestListData[]>
export type EventGuestlistConfigResponse = ApiResponse<EventGuestlistCongigData>