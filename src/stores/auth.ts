import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

import type { User } from '@/types/user'
import {
  getMe,
  login as loginRequest,
  loginWithGoogle as googleLoginRequest,
  register as registerRequest,
  logout as logoutRequest,
} from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)

  const loading = ref(false)

  const isAuthenticated = computed(() => !!user.value)

  const hasRole = (role: string) => {
    return user.value?.roles?.includes(role) ?? false
  }

  async function fetchMe() {
    try {
      loading.value = true

      const data = await getMe()

      user.value = data
    } catch {
      user.value = null
    } finally {
      loading.value = false
    }
  }

  async function login(email: string, password: string) {
    try {
      loading.value = true

      await loginRequest(email, password)
      await fetchMe()
    } finally {
      loading.value = false
    }
  }

  function loginWithGoogle() {
    googleLoginRequest()
  }

  async function register(email: string, fullName: string, password: string) {
    try {
      loading.value = true

      const data = await registerRequest(email, fullName, password)
    } finally {
      loading.value = false
    }
  }

  async function logout() {
    try {
      await logoutRequest()
    } finally {
      user.value = null
    }
  }

  return {
    user,
    loading,
    isAuthenticated,
    hasRole,
    fetchMe,
    login,
    loginWithGoogle,
    register,
    logout,
  }
})
