import type {
  CheckoutRequest,
  CheckoutResponse,
  CheckoutResponseData,
  CreateCartResponse,
  GetAllCartResponse,
  GetCartResponse,
  InitializePaymentResponse,
  UpdatedCreateCartRequest,
  ValidatePromocodeRequest,
  ValidatePromocodeResponse,
} from '@/types/cart'
import api from './http.service'
import type { ApiResponse } from '@/types'

class CartServce {
  /**
   * Get all cart
   */
  async getAllCart(): Promise<GetAllCartResponse> {
    const response = await api.get('/api/Cart')
    return response.data
  }

  /**
   * Create cart
   */
  async createCart(data: UpdatedCreateCartRequest): Promise<CreateCartResponse> {
    const response = await api.post('/api/Cart', data)
    return response.data
  }

  /**
   * Delete cart
   */
  async deleteCart(cartId: string): Promise<ApiResponse<unknown>> {
    const response = await api.delete(`/api/cart/${cartId}`)
    return response.data
  }

  /**
   * Get cart
   */
  async getCart(cartId: string): Promise<GetCartResponse> {
    const response = await api.get(`/api/cart/${cartId}`)
    return response.data
  }

  /**
   * Update cart quantity
   */
  async updateQuantity(cartId: string, data: number): Promise<ApiResponse<unknown>> {
    const response = await api.patch(`/api/cart/${cartId}/quantity`, data)
    return response.data
  }

    /**
   * Sync Local cart to server cart
   */
  async syncCart(items: UpdatedCreateCartRequest[]): Promise<ApiResponse<unknown>> {
    const response = await api.post('/api/cart/sync', { items })
    console.log('syncCart response', response.data)
    return response.data
  }

  /**
   * Clear cart
   */
  async clearCart(): Promise<ApiResponse<unknown>> {
    const response = await api.delete('/api/Cart/clear')
    return response.data
  }

  /**
   * Checkout cart
   */
  async checkoutCart(data: CheckoutRequest): Promise<CheckoutResponse> {
    const response = await api.post('/api/Cart/checkout', data)
    return response.data
  }

  /**
   * Validate promo-code
   */
  async validatePromoCode(data: ValidatePromocodeRequest): Promise<ValidatePromocodeResponse> {
    const response = await api.post('api/Cart/validate-promocode', data)
    return response.data
  }

  /**
   * Initalize payment for cart
   */
  async initialzePayment(promoCodeId:string, callbackUrl: string): Promise<InitializePaymentResponse> {
    const response = await api.post('/api/Cart/initialize-payment', { promoCodeId, callbackUrl })
    return response.data
  }

  /**
   * Processes cart checkout after payment is completed
   */
  async processCheckout(data: CheckoutRequest): Promise<CheckoutResponseData>{
    const response = await api.post('/api/Cart/checkout', data)
    return response.data
  }

  /**
   * Extend reservation
   */
  async extendReservation(cartId: string): Promise<ApiResponse<unknown>> {
    const response = await api.post(`/api/Cart/${cartId}/extend-reservation`)
    return response.data
  }
}

export const cartService = new CartServce()
