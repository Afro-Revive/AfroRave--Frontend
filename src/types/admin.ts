import type { ApiResponse, PaginatedResponse } from './api'

/** The account types the admin users list can filter by. "User" is a fan. */
export type AdminAccountType = 'User' | 'Organizer' | 'Vendor' | 'Admin'

/** GET /api/Admin/users. Newest first. */
export interface AdminUser {
  userId: string
  email: string
  accountType: AdminAccountType
  firstName: string
  lastName: string
  phoneNumber: string | null
  /** False once suspended. A suspended user can't log in. */
  active: boolean
  createdDate: string
}

/** published, draft (unpublished and not suspended), or suspended. */
export type AdminEventStatus = 'published' | 'draft' | 'suspended'

/** GET /api/Admin/events. Newest first. */
export interface AdminEvent {
  eventId: string
  eventName: string
  venue: string | null
  category: string | null
  organizerEmail: string | null
  published: boolean
  isSuspended: boolean
  /** Dates only (yyyy-MM-dd), no times. */
  startDate: string
  endDate: string
  createdDate: string
}

/** GET /api/Admin/orders. Newest first. */
export interface AdminOrder {
  orderId: string
  orderCode: string
  ticketCount: number
  /** "Completed" or "Refunded". */
  status: string
  /** free, paystack (any casing), Invite… */
  paymentMethod: string | null
  cost: number
  tax: number
  userEmail: string | null
  purchaseDate: string
}

/**
 * What a wallet transaction was for. Older rows are sorted from their type and
 * description; a plain credit or debit stays WalletCredit or WalletDebit.
 */
export type AdminTransactionCategory =
  | 'Funding'
  | 'Withdrawal'
  | 'Refund'
  | 'ResalePurchase'
  | 'ResalePayout'
  | 'WalletCredit'
  | 'WalletDebit'
  | 'Other'

/** GET /api/Admin/transactions: the wallet ledger only, not every payment. Newest first. */
export interface AdminTransaction {
  transactionId: string
  /** Credit, Debit, Withdrawal, Refund… */
  transactionType: string
  category: AdminTransactionCategory
  /** How the category was worked out, e.g. LegacyTypeAndDescription. */
  categorySource: string
  /** Completed, Pending… */
  status: string
  reference: string | null
  ledger: string
  amount: number
  description: string | null
  userEmail: string | null
  createdDate: string
}

export interface AdminListParams {
  pageNumber?: number
  pageSize?: number
  searchQuery?: string
}

export interface AdminUsersParams extends AdminListParams {
  role?: AdminAccountType
}

export interface AdminEventsParams extends AdminListParams {
  status?: AdminEventStatus
}

/** Page size is 1 to 100 here; an unknown category is a 400. */
export interface AdminTransactionsParams extends AdminListParams {
  category?: AdminTransactionCategory
  transactionType?: string
  status?: string
}

/** GET /api/Admin/analytics: all-time counts, not a finance report. */
export interface AdminAnalytics {
  /** Inactive counts unfinished sign-ups as well as suspended accounts. */
  users: { total: number; active: number; inactive: number }
  usersByRole: { role: AdminAccountType | string; total: number; active: number; inactive: number }[]
  events: { total: number; published: number; draft: number; suspended: number }
  ticketOrders: {
    total: number
    completed: number
    refunded: number
    other: number
    /** Completed orders' cost, tax included. Not platform profit. */
    grossCompletedAmount: number
    /** Already inside grossCompletedAmount. */
    completedTax: number
    amountDefinition: string
  }
}

/** PATCH …/users/{id}/suspension and …/events/{id}/suspension. */
export interface AdminSuspensionResult {
  id: string
  isSuspended: boolean
  /** Events only. Unsuspending leaves it unpublished. */
  published?: boolean | null
}

/** DELETE /api/Admin/users/{id}. Success is Deleted or Deactivated. */
export interface AdminUserRemovalResult {
  userId: string
  outcome: 'Deleted' | 'Deactivated' | 'NotFound' | 'ProtectedAdmin' | 'Failed'
  /** False when deactivated, null when deleted. */
  active: boolean | null
}

/** GET /api/Admin/events/{id}. Works for drafts and suspended events. */
export interface AdminEventDetails {
  eventId: string
  eventName: string
  ageRating: string | null
  venue: string | null
  /** The editor's HTML, or older plain text. */
  description: string | null
  customUrl: string | null
  category: string | null
  stage: string | null
  published: boolean
  isSuspended: boolean
  accessType: string
  accessDeadline: string | null
  isApplicationPaused: boolean
  isApplicationEnded: boolean
  createdDate: string | null
  updatedDate: string | null
  organizer: {
    userId: string
    email: string | null
    firstName: string | null
    lastName: string | null
    companyName: string | null
    phoneNumber: string | null
    website: string | null
  }
  /** Wall-clock dates and times in the event's own timezone. */
  dates: {
    timezone: string | null
    startDate: string
    endDate: string
    /** HH:mm:ss, or empty when not set. */
    startTime: string
    endTime: string
    frequency: string | null
    occurance: number | null
  } | null
  tickets: {
    ticketId: string
    ticketName: string
    accessType: string | null
    salesType: string | null
    ticketType: string | null
    quantity: number | null
    usedQuantity: number | null
    price: number | null
    purchaseLimit: number
    groupSize: number | null
    validDays: number
    description: string | null
  }[]
  vendorSlots: {
    id: string
    vendorType: string
    category: string
    description: string | null
    status: string | null
    applicationDeadline: string | null
    slot: { slotName: string | null; slotNumber: number | null; price: number | null; applicationDeadline: string | null } | null
    service: {
      serviceName: string | null
      hasBudgetRange: boolean | null
      minBudget: number | null
      maxBudget: number | null
      startTime: string | null
      stopTime: string | null
      startDate: string | null
      endDate: string | null
      applicationDeadline: string | null
    } | null
  }[]
}

/** GET /api/Configuration/fees. Values are fractions: 0.08 is 8%. */
export interface FeeConfiguration {
  id: string
  feeType: string
  description: string | null
  percentageValue: number
  /** The backend only accepts 0. */
  fixedValue: number
  isActive: boolean
  lastUpdatedByUserId: string
  updatedAt: string
}

/** PUT /api/Configuration/fees. */
export interface UpdateFeeRequest {
  feeType: string
  percentageValue: number
  fixedValue: 0
}

/** GET /api/Configuration/fees/audit/{feeType}. Newest first. */
export interface FeeConfigurationAudit {
  id: string
  feeConfigurationId: string
  feeType: string
  action: 'Created' | 'Updated' | string
  oldPercentageValue: number | null
  newPercentageValue: number | null
  oldFixedValue: number | null
  newFixedValue: number | null
  /** The admin's user id; the backend doesn't send a name or email. */
  modifiedByUserId: string
  modifiedAt: string
}

/** An ApiResponse whose data is known to be T (ApiResponse's own data also allows a page). */
type Response<T> = Omit<ApiResponse<T>, 'data'> & { data: T }

export type AdminPage<T> = Response<PaginatedResponse<T>>
export type AdminActionResponse = Response<boolean>
export type AdminAnalyticsResponse = Response<AdminAnalytics>
export type AdminEventDetailsResponse = Response<AdminEventDetails>
export type AdminSuspensionResponse = Response<AdminSuspensionResult>
export type AdminUserRemovalResponse = Response<AdminUserRemovalResult>
export type FeeConfigurationsResponse = Response<FeeConfiguration[]>
export type FeeAuditResponse = Response<FeeConfigurationAudit[]>
