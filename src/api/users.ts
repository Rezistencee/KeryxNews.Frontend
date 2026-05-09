import { api } from './client'

export async function getUserById(id: string) {
  const response = await api.get(`/user/${id}`)

  return response.data
}

export async function getUserWithArticles(id: string) {
  const response = await api.get(`/user/${id}/articles`)

  return response.data
}
