import type { Article } from '@/types/article'
import { api } from './client'
import type { PageResponse } from '@/types/pageResponse'

export async function getArticleById(id: string): Promise<Article> {
  const response = await api.get<Article>(`/article/${id}`)

  return response.data
}

export async function getLatest(
  page: number = 1,
  pageSize: number = 5,
): Promise<PageResponse<Article>> {
  const response = await api.get<PageResponse<Article>>(
    `/article?page=${page}&pageSize=${pageSize}`,
  )

  return response.data
}

export async function getTrending(count: number = 3): Promise<Article[]> {
  const response = await api.get<Article[]>(`/article/trending?count=${count}`)

  return response.data
}
