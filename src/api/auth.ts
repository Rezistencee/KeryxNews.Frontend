import { api } from './client'

const API_URL = 'http://localhost:5052'

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
  window.location.href = `${API_URL}/auth/external/google`
}

export async function register(email: string, fullName: string, password: string) {
  const response = await api.post('/auth/register', {
    email,
    fullName,
    password,
  })

  return response.data
}

export async function logout() {
  await api.post('/auth/logout')
}
