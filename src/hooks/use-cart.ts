import { cartService } from '@/services/cart.service'
import type { CheckoutRequest, CreateCartRequest, ValidatePromocodeRequest } from '@/types/cart'
import { useAfroStore, useCartStore } from '@/stores'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cartKeys } from '@/lib/cart-keys'

export function useGetAllCart() {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  return useQuery({
    queryKey: cartKeys.lists(),
    queryFn: () =>{
      if(!isAuthenticated) {
        const localCartItems = useCartStore.getState().items
        // return a promise that resolves to an object with the same shape as the API response
        return Promise.resolve({ data: localCartItems })
      }
      return cartService.getAllCart()
    },
  })
}

export function useCreateCart() {
  const queryClient = useQueryClient()
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)


  return useMutation({
    mutationFn: async (data: CreateCartRequest) => {
      // if user is not authenticated, add to local cart and return
      if (!isAuthenticated) {
        useCartStore.getState().addItem(data)
        return
      }
      // if user is authenticated, make API call to add to cart
      return cartService.createCart(data)
    },
    onSuccess: () => {
      toast.success('Added to cart.')
      if (isAuthenticated) {
        queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
      }
    },
    onError: () => toast.error('Failed to add to cart.'),
  })
}

export function useDeleteCart() {
  const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async({ cartId }: { cartId: string }) => {
      if(!isAuthenticated) {
        useCartStore.getState().removeItem(cartId)
        return
      }
      return cartService.deleteCart(cartId)
    },
    onSuccess: (_, cartId) => {
      toast.success('Cart deleted successfully.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(cartId.cartId) })
    },
    onError: () => toast.error('Failed to delete cart.'),
  })
}

export function useGetCart(cartId: string) {
  return useQuery({
    queryKey: cartKeys.detail(cartId),
    queryFn: () => cartService.getCart(cartId),
  })
}

export function useUpdateCartQuantity() {
    const isAuthenticated = useAfroStore((state) => state.isAuthenticated)
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ cartId, data }: { data: number; cartId: string }) => {
      // where cartId is ticketId for local cart and cartId for server cart.
      if (!isAuthenticated) {
        useCartStore.getState().updateQuantity(cartId, data)
        return
      }
      return cartService.updateQuantity(cartId, data)
    },
    onSuccess: (_, { cartId }) => {
      toast.success('Quantity updated successfully.')
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(cartId) })
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to update quantity'),
  })
}

export function useClearCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: () => cartService.clearCart(),
    onSuccess: () => {
      toast.success('Cart cleared successfully.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to clear cart.'),
  })
}

export function useCheckoutCart() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ data }: { data: CheckoutRequest }) => cartService.checkoutCart(data),
    mutationKey: cartKeys.checkout(),
    onSuccess: () => {
      toast.success('Checkout successful.')
      queryClient.invalidateQueries({ queryKey: cartKeys.lists() })
    },
    onError: () => toast.error('Failed to checkout.'),
  })
}

export function useValidatePromocode() {
  return useMutation({
    mutationFn: ({ data }: { data: ValidatePromocodeRequest }) =>
      cartService.validatePromoCode(data),
    mutationKey: cartKeys.validatePromocode(),
    onSuccess: () => toast.success('Promocode validated successfully.'),
    onError: () => toast.error('Failed to validate promocode.'),
  })
}

export function useExtendReservation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ cartId }: { cartId: string }) => cartService.extendReservation(cartId),
    mutationKey: cartKeys.extendReservation('dynamic-id'), // replaced at runtime
    onSuccess: (_, cartId) => {
      toast.success('Reservation extended successfully.')
      queryClient.invalidateQueries({ queryKey: cartKeys.detail(cartId.cartId) })
    },
    onError: () => toast.error('Failed to extend reservation.'),
  })
}
