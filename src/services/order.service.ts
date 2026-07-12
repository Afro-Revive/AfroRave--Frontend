import api from "./http.service";
import { OrderReceiptDetailsResponse } from "@/types/order";

class OrderService {
    /**
     * Get order receipt details by order ID
     */
    async getOrderReceiptDetails(orderId: string): Promise<OrderReceiptDetailsResponse> {
        const response = await api.get<OrderReceiptDetailsResponse>(`/api/Profile/user/order/${orderId}`);
        return response.data;
    }
}


export const orderService = new OrderService();