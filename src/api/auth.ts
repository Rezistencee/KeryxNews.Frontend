import { api } from './client'

export async function getMe() {
  const response = await api.get('/auth/me')

  return response.data
}

export async function login(email: string, password: string) {
  const response = await api.post('/auth/login', {
    email,
    password,
  })

  return response.data
}

export function loginWithGoogle() {
  window.location.href = `${api.defaults.baseURL}/auth/external/google`
}

export async function register(email: string, fullName: string, password: string) {
  const response = await api.post('/auth/register', {
    email,
    fullName,
    password,
  })

  return response.data
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  await api.post('/auth/me/password', {
    currentPassword: data.currentPassword,
    newPassword: data.newPassword,
  })
}

export async function logout() {
  await api.post('/auth/logout')
}
