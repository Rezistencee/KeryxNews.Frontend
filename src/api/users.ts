import type { PageResponse } from '@/types/pageResponse'
import { api } from './client'
import type { User } from '@/types/user'

export async function getUsers(
  page: number = 1,
  pageSize: number = 20,
  search: string = '',
): Promise<PageResponse<User>> {
  const response = await api.get(
    `/user?page=${page}&pageSize=${pageSize}&search=${encodeURIComponent(search)}`,
  )

  return response.data
}

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

export async function reportUser(userId: string, reason: string) {
  const response = await api.post(`/user/${userId}/reports`, {
    reason,
  })

  return response.data
}

export const updateUserRoles = async (userId: string, roles: string[]) => {
  return await api.put(`/user/${userId}/roles`, {
    roles,
  })
}

export async function deleteUser(id: string) {
  const response = await api.delete(`/user/${id}`)
  return response.data
}

export const banUser = (id: string, payload: { reason: string; until?: string | null }) =>
  api.post(`/user/${id}/ban`, payload)

export const unbanUser = (id: string) => api.post(`/user/${id}/unban`)
