import type { CreateEventRequest } from '@/types'
import type { User } from '@/types/auth'
import { CartLineItem } from '@/types/cart'
import { decodeTokenExpiry, isTokenExpired } from '@/lib/token'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AfroState {
  user: User | null
  token: string | null
  refreshToken: string | null
  tokenExpiry: number | null
  isAuthenticated: boolean
  isCreator: boolean
  isFan: boolean
  isVendor: boolean
  setAuth: (user: User, token: string, refreshToken?: string) => void
  setToken: (token: string) => void
  setTokens: (token: string, refreshToken: string) => void
  clearAuth: () => void
  updateUser: (user: User) => void
}

interface EventState {
  eventId: string | null
  eventData: CreateEventRequest | null
  /**
   * Kept beside eventData rather than inside it: CreateEventRequest has no
   * visibility field, but later steps of the create flow need to know — the
   * ticket formats on offer depend on it.
   */
  visibility: 'public' | 'private' | null
  setEventId: (id: string) => void
  setEventData: (data: CreateEventRequest) => void
  setVisibility: (visibility: 'public' | 'private') => void
  resetEventData: () => void
}

// Load initial state from localStorage
const getInitialState = () => {
  try {
    const stored = localStorage.getItem('afro-store-v1')
    if (stored) {
      const parsed = JSON.parse(stored)
      const token: string | null = parsed.state?.token || null

      // Don't restore auth state if the token is already expired
      if (token && isTokenExpired(token)) {
        localStorage.removeItem('afro-store-v1')
        return { user: null, token: null, refreshToken: null, tokenExpiry: null, isAuthenticated: false }
      }

      return {
        user: parsed.state?.user || null,
        token,
        refreshToken: parsed.state?.refreshToken || null,
        tokenExpiry: token ? decodeTokenExpiry(token) : null,
        isAuthenticated: parsed.state?.isAuthenticated || false,
      }
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error)
  }
  return { user: null, token: null, refreshToken: null, tokenExpiry: null, isAuthenticated: false }
}

const initialState = getInitialState()

export const useAfroStore = create<AfroState>()((set, get) => ({
  user: initialState.user,
  token: initialState.token,
  refreshToken: initialState.refreshToken,
  tokenExpiry: initialState.tokenExpiry,
  isAuthenticated: initialState.isAuthenticated,
  isCreator: initialState.user?.accountType === 'Organizer',
  isFan: initialState.user?.accountType === 'User',
  isVendor: initialState.user?.accountType === 'Vendor',
  setAuth: (user: User, token: string, refreshToken?: string) => {
    const newState = {
      user,
      token,
      refreshToken: refreshToken ?? null,
      tokenExpiry: decodeTokenExpiry(token),
      isAuthenticated: true,
      isCreator: user.accountType === 'Organizer',
      isFan: user.accountType === 'User',
      isVendor: user.accountType === 'Vendor',
    }
    set(newState)
    localStorage.setItem('afro-store-v1', JSON.stringify({ state: newState }))
  },
  setToken: (token: string) => {
    const currentState = get()
    const newState = { ...currentState, token, tokenExpiry: decodeTokenExpiry(token) }
    set(newState)
    localStorage.setItem('afro-store-v1', JSON.stringify({ state: newState }))
  },
  setTokens: (token: string, refreshToken: string) => {
    const currentState = get()
    const newState = { ...currentState, token, refreshToken, tokenExpiry: decodeTokenExpiry(token) }
    set(newState)
    localStorage.setItem('afro-store-v1', JSON.stringify({ state: newState }))
  },
  clearAuth: () => {
    const newState = {
      user: null,
      token: null,
      refreshToken: null,
      tokenExpiry: null,
      isAuthenticated: false,
      isCreator: false,
      isFan: false,
      isVendor: false,
    }
    set(newState)
    localStorage.removeItem('afro-store-v1')
    useCartStore.getState().clearLocal()
  },
  updateUser: (user: User) => {
    const currentState = get()
    const newState = {
      ...currentState,
      user,
      isCreator: user.accountType === 'Organizer',
      isFan: user.accountType === 'User',
      isVendor: user.accountType === 'Vendor',
    }
    set(newState)
    localStorage.setItem('afro-store-v1', JSON.stringify({ state: newState }))
  },
}))

export const useEventStore = create<EventState>()((set) => ({
  eventId: null,
  eventData: null,
  visibility: null,
  setEventId: (id: string) => set({ eventId: id }),
  setEventData: (data: CreateEventRequest) => set({ eventData: data }),
  setVisibility: (visibility: 'public' | 'private') => set({ visibility }),
  resetEventData: () => set({ eventId: null, eventData: null, visibility: null }),
}))

interface GuideState {
  guideActive: boolean
  guideStep: number
  startGuide: () => void
  nextGuideStep: () => void
  prevGuideStep: () => void
  endGuide: () => void
}

export const useGuideStore = create<GuideState>()((set) => ({
  guideActive: false,
  guideStep: 0,
  startGuide: () => set({ guideActive: true, guideStep: 0 }),
  nextGuideStep: () => set((s) => ({ guideStep: s.guideStep + 1 })),
  prevGuideStep: () => set((s) => ({ guideStep: Math.max(0, s.guideStep - 1) })),
  endGuide: () => set({ guideActive: false, guideStep: 0 }),
}))

interface EventSelectorState {
  selectedEventId: string | null
  setSelectedEventId: (id: string | null) => void
}

// Persisted so the sidebar's selected-event card survives a refresh. Most
// creator pages carry no event id in their URL, so without this the selection
// is only recoverable by going back through the events dashboard.
export const useEventSelectorStore = create<EventSelectorState>()(
  persist(
    (set) => ({
      selectedEventId: null,
      setSelectedEventId: (id) => set({ selectedEventId: id }),
    }),
    { name: 'afro-selected-event' },
  ),
)


interface CartState {
  items: CartLineItem[]
  /**
   * The custom URL of the event these items belong to. A cart only ever holds
   * one event's tickets: it's cleared when the fan leaves the cart or checkout.
   */
  eventSlug: string | null
  isSyncingCart: boolean
  promoCodeId: string | null
  setPromoCodeId: (id: string | null) => void
  /**
   * When the server last reserved the cart's tickets. The checkout countdown
   * runs from here, so a refresh carries on rather than resetting it.
   */
  reservationStartedAt: number | null
  /** Restarts the countdown. Call it right after the server reserves the tickets. */
  startReservation: () => void
  addItem: (eventSlug: string, item: CartLineItem) => void
  removeItem: (cartKey: string) => void
  updateQuantity: (cartKey: string, quantity: number) => void
  clearLocal: () => void
  setSyncing: (value: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      eventSlug: null,
      isSyncingCart: false,
      promoCodeId: null,
      setPromoCodeId: (id) => set({ promoCodeId: id }),
      reservationStartedAt: null,
      // Called each time the server reserves the tickets: after a cart sync and
      // after an extension. Saved, so a refresh carries on from the same start.
      startReservation: () => set({ reservationStartedAt: Date.now() }),
      addItem: (eventSlug, item) =>
        set((state) => {
          // Never let a line exceed the ticket's per-buyer purchase limit.
          const limit = item.purchaseLimit ?? Number.POSITIVE_INFINITY
          const existing = state.items.find((i) => i.cartKey === item.cartKey)
          if (existing) {
            return {
              eventSlug,
              items: state.items.map((i) =>
                i.cartKey === item.cartKey
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, limit) }
                  : i,
              ),
            }
          }
          return {
            eventSlug,
            items: [...state.items, { ...item, quantity: Math.min(item.quantity, limit) }],
          }
        }),
      removeItem: (cartKey) =>
        set((state) => ({ items: state.items.filter((i) => i.cartKey !== cartKey) })),
      updateQuantity: (cartKey, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.cartKey !== cartKey)
              : state.items.map((i) =>
                  i.cartKey === cartKey
                    ? {
                        ...i,
                        quantity: Math.min(quantity, i.purchaseLimit ?? Number.POSITIVE_INFINITY),
                      }
                    : i,
                ),
        })),
      clearLocal: () =>
        set({ items: [], eventSlug: null, promoCodeId: null, reservationStartedAt: null }),
      setSyncing: (value) => set({ isSyncingCart: value }),
    }),
    {
      name: 'afro-cart',
      partialize: (state) => ({
        items: state.items,
        eventSlug: state.eventSlug,
        promoCodeId: state.promoCodeId,
        reservationStartedAt: state.reservationStartedAt,
      }),
      version: 2,
      // Version 1 carts don't record their event, so there's no telling which
      // event they belong to. Start those fans with an empty cart.
      migrate: (persisted, version) =>
        version < 2
          ? { items: [], eventSlug: null, promoCodeId: null, reservationStartedAt: null }
          : (persisted as Pick<
              CartState,
              'items' | 'eventSlug' | 'promoCodeId' | 'reservationStartedAt'
            >),
    },
  ),
)
