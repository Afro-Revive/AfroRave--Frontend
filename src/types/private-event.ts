import { ApiResponse } from "./api";
export interface ViewerAccessStatusData {
    eventId: string;
    accessType: "Public" | "Private";
    status: "Approved" | "Pending" | "Denied" | "NotRequested";
    canRequestAccess: boolean;
    canPurchaseTickets: boolean;
    deadline: string | null;
    isApplicationPaused: boolean;
    isApplicationEnded: boolean;
}

export interface AccessRequestData{
    requestId: string;
    eventId: string
    eventName: string;
    userId: string;
    userName: string;
    userEmail: string;
    status: "Pending" | "Approved" | "Denied";
    requestedDate: string;
    decidedDate: string | null;
    // currently doesnt exist in the backend but will be added soon. Shaped like
    // EventOrdersData; until it arrives, approved fans show "No orders made".
    order?: {
        orderCode: string;
        cost: number;
        items: { ticketName: string; quantity: number }[];
    } | null;
}

export type AccessRequestResponse = ApiResponse<AccessRequestData>;
export type ViewerAccessStatusResponse = ApiResponse<ViewerAccessStatusData>;