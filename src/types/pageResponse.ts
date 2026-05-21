export interface PaginationMeta {
  page: number
  limit: number
  total: number
}

export interface PageResponse<T> {
  items: T[]
  meta: PaginationMeta
}
