import { api } from './client'

export async function getUserById(id: string) {
  const response = await api.get(`/user/${id}`)

  return response.data
}

export async function changeProfile(data: { fullName: string; avatarUrl: string }) {
  const response = await api.put('/user/profile', data)
  return response.data
}

export async function getUserWithArticles(id: string) {
  const response = await api.get(`/user/${id}/articles`)

  return response.data
}

export async function getUserComments(id: string) {
  const response = await api.get(`/user/${id}/comments`)

  return response.data
}
