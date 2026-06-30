export interface Pagination {
  total: number
  page: number
  size: number
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
  pagination?: Pagination | null
}
