import type { Article } from '@/types/article'
import { api } from './client'
import type { PageResponse } from '@/types/pageResponse'

export async function getArticleById(id: string): Promise<Article> {
  const response = await api.get<Article>(`/article/${id}`)

  return response.data
}

export async function getLatest(
  page = 1,
  pageSize = 10,
  search = '',
  sortBy = 'Date',
): Promise<PageResponse<Article>> {
  const response = await api.get<PageResponse<Article>>(
    `/article?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}&sortBy=${sortBy}`,
  )

  return response.data
}

export async function getTrending(count: number = 3): Promise<Article[]> {
  const response = await api.get<Article[]>(`/article/trending?count=${count}`)

  return response.data
}

export async function getMyArticles() {
  const response = await api.get('/article/my')
  return response.data
}

export async function getPendingArticles() {
  const response = await api.get('/article/pending')
  return response.data
}

export async function createArticle(data: {
  title: string
  content: string
  imageUrl?: string | null
}) {
  const response = await api.post('/article', data)
  return response.data
}

export const updateArticle = async (
  id: string,
  payload: {
    title: string
    content: string
    imageUrl?: string | null
  },
) => {
  const { data } = await api.put(`/article/${id}`, payload)

  return data
}

export async function submitArticle(id: string) {
  const response = await api.post(`/article/${id}/submit`)

  return response.data
}

export async function publishArticle(id: string) {
  const response = await api.post(`/article/${id}/publish`)

  return response.data
}

export async function rejectArticle(id: string) {
  const response = await api.post(`/article/${id}/reject`)

  return response.data
}
