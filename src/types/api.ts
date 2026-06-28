// API Response Types
export interface ApiResponse<T> {
  message: string
  data: PaginatedResponse<T> | T
  cursor?: string
  id?: string
  status: boolean
  statusCode: number
}

export interface PaginatedResponse<T> {
    hasNext: boolean
    hasPrevious: boolean
    items: T[]
    pageNumber: number
    pageSize: number
    totalCount: number
    totalPages: number
}