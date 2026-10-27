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
    categoryIds?: string[]
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

export interface EventCheckinGuest {
    guestId: string
    name: string
    email: string
    categoryName: string | null
    isCheckedIn: boolean
    checkedInAt: string | null
}

export interface GuestListAllowanceData {
    usedGuests: number
    totalGuests: number
    remainingGuests: number
    usedCategories: number
    totalCategories: number
    remainingCategories: number
    maxGuestsPerCategory: number
    categoryUsages: CategoryUsage[]
}

export interface CategoryUsage {
    categoryId: string
    categoryName: string
    usedGuests: number
    totalGuests: number
    remainingGuests: number
}


export type CategoryResponse = ApiResponse<CategoryData[]>
export type GuestListResponse = ApiResponse<GuestListData[]>
export type EventGuestlistConfigResponse = ApiResponse<EventGuestlistCongigData>
export type EventCheckinListResponse = ApiResponse<EventCheckinGuest[]>
export type GuestListAllowanceResponse = ApiResponse<GuestListAllowanceData>
