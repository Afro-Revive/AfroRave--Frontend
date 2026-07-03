export const cartKeys = {
  all: ['cart'] as const,
  lists: () => [...cartKeys.all, 'list'] as const,
  list: (filters?: string) => [...cartKeys.lists(), { filters }] as const,
  details: () => [...cartKeys.all, 'detail'] as const,
  detail: (id: string) => [...cartKeys.details(), id] as const,
  checkout: () => [...cartKeys.all, 'checkout'] as const,
  processCheckout: () => [...cartKeys.all, 'process-checkout'] as const,
  validatePromocode: () => [...cartKeys.all, 'validate-promocode'] as const,
  extendReservation: (id: string) => [...cartKeys.detail(id), 'extend-reservation'] as const,
}
