export interface Pagination {
  next_cursor: string | null
  has_more: boolean
  limit: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  pagination?: Pagination | null
}
