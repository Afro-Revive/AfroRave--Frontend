import { cartService } from '@/services/cart.service'
import type {
  CheckoutRequest,
  CreateCartRequest,
  ValidatePromocodeRequest,
  ValidatePromocodeResponse,
} from '@/types/cart'
import type { ApiErrorResponse } from '@/types/api'
import { useAfroStore, useCartStore } from '@/stores'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { toast } from 'sonner'
import { cartKeys } from '@/lib/cart-keys'

// Always reads from local store — server sync happens only when user clicks Continue
export function useGetAllCart() {
  return useQuery({
    queryKey: cartKeys.lists(),
    queryFn: () => Promise.resolve({ data: useCartStore.getState().items }),
  })
}

export function useCreateCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: CreateCartRequest) => {
      useCartStore.getState().addItem(data)
    },
    onSuccess: () => {
      toast.success('Added to cart.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to add to cart.'),
  })
}

export function useDeleteCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ cartId }: { cartId: string }) => {
      useCartStore.getState().removeItem(cartId)
    },
    onSuccess: () => {
      toast.success('Cart item removed.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to remove from cart.'),
  })
}

export function useGetCart(cartId: string) {
  return useQuery({
    queryKey: cartKeys.detail(cartId),
    queryFn: () => cartService.getCart(cartId),
  })
}

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ cartId, data }: { data: number; cartId: string }) => {
      useCartStore.getState().updateQuantity(cartId, data)
    },
    onSuccess: () => {
      toast.success('Quantity updated.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to update quantity'),
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  return useMutation({
    mutationFn: async () => {
      if (isAuthenticated) {
        await cartService.clearCart()
      }
      useCartStore.getState().clearLocal()
    },
    onSuccess: () => {
      toast.success('Cart cleared.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to clear cart.'),
  })
}

// Syncs local cart items to server — called when authenticated user clicks Continue
export function useSyncCartToServer() {
  return useMutation({
    mutationFn: async () => {
      const items = useCartStore.getState().items
      if (items.length === 0) return
      await cartService.syncCart(items.map(({ ticketId, quantity }) => ({ ticketId, quantity })))
    },
    onError: () => toast.error('Failed to sync cart. Please try again.'),
  })
}

export function useCheckoutCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ promoCodeId, callbackUrl }: { promoCodeId: string; callbackUrl: string }) => cartService.initialzePayment(promoCodeId, callbackUrl),
    mutationKey: cartKeys.checkout(),
    onSuccess: () => {
      toast.success('Checkout successful.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to checkout.'),
  })
}

export function useProcessCheckout() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CheckoutRequest) => cartService.processCheckout(data),
    mutationKey: cartKeys.processCheckout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to process checkout.'),
  })
}

export function useValidatePromocode() {
  return useMutation<
    ValidatePromocodeResponse,
    AxiosError<ApiErrorResponse>,
    { data: ValidatePromocodeRequest }
  >({
    mutationFn: ({ data }) => cartService.validatePromoCode(data),
    mutationKey: cartKeys.validatePromocode(),
    onSuccess: () => toast.success('Promocode validated successfully.'),
  })
}

export function useExtendReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cartId }: { cartId: string }) => cartService.extendReservation(cartId),
    mutationKey: cartKeys.extendReservation('dynamic-id'),
    onSuccess: (_, cartId) => {
      toast.success('Reservation extended successfully.')
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(cartId.cartId) })
    },
    onError: () => toast.error('Failed to extend reservation.'),
  })
}
