import type { CreateEventRequest } from '@/types'
import type { User } from '@/types/auth'
import { CreateCartRequest } from '@/types/cart'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AfroState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isCreator: boolean
  isFan: boolean
  isVendor: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
  updateUser: (user: User) => void
}

interface EventState {
  eventId: string | null
  eventData: CreateEventRequest | null
  setEventId: (id: string) => void
  setEventData: (data: CreateEventRequest) => void
  resetEventData: () => void
}

// Load initial state from localStorage
const getInitialState = () => {
  try {
    const stored = localStorage.getItem('afro-store-v1')
    if (stored) {
      const parsed = JSON.parse(stored)
      const user = parsed.state?.user || null
      return {
        user,
        token: parsed.state?.token || null,
        isAuthenticated: parsed.state?.isAuthenticated || false,
      }
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error)
  }
  return {
    user: null,
    token: null,
    isAuthenticated: false,
  }
}

const initialState = getInitialState()

export const useAfroStore = create<AfroState>()((set, get) => ({
  user: initialState.user,
  token: initialState.token,
  isAuthenticated: initialState.isAuthenticated,
  isCreator: initialState.user?.accountType === 'Organizer',
  isFan: initialState.user?.accountType === 'User',
  isVendor: initialState.user?.accountType === 'Vendor',
  setAuth: (user: User, token: string) => {
    const newState = {
      user,
      token,
      isAuthenticated: true,
      isCreator: user.accountType === 'Organizer',
      isFan: user.accountType === 'User',
      isVendor: user.accountType === 'Vendor',
    }
    set(newState)
    localStorage.setItem('afro-store-v1', JSON.stringify({ state: newState }))
  },
  clearAuth: () => {
    const newState = {
      user: null,
      token: null,
      isAuthenticated: false,
      isCreator: false,
      isFan: false,
      isVendor: false,
    }
    set(newState)
    localStorage.removeItem('afro-store-v1')
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
  setEventId: (id: string) => set({ eventId: id }),
  setEventData: (data: CreateEventRequest) => set({ eventData: data }),
  resetEventData: () => set({ eventId: null, eventData: null }),
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

export const useEventSelectorStore = create<EventSelectorState>()((set) => ({
  selectedEventId: null,
  setSelectedEventId: (id) => set({ selectedEventId: id }),
}))


interface CartState {
  items: CreateCartRequest[]
  isSyncingCart: boolean
  addItem: (item: CreateCartRequest) => void
  removeItem: (ticketId: string) => void
  updateQuantity: (ticketId: string, quantity: number) => void
  clearLocal: () => void
  setSyncing: (value: boolean) => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isSyncingCart: false,
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.ticketId === item.ticketId)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.ticketId === item.ticketId
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { items: [...state.items, item] }
        }),
      removeItem: (ticketId) =>
        set((state) => ({ items: state.items.filter((i) => i.ticketId !== ticketId) })),
      updateQuantity: (ticketId, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.ticketId !== ticketId)
              : state.items.map((i) => (i.ticketId === ticketId ? { ...i, quantity } : i)),
        })),
      clearLocal: () => set({ items: [] }),
      setSyncing: (value) => set({ isSyncingCart: value }),
    }),
    {
      name: 'afro-cart',
      partialize: (state) => ({ items: state.items }),
    },
  ),
)
