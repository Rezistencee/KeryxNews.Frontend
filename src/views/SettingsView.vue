<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'

import { useAuthStore } from '@/stores/auth'
import { changePassword } from '@/api/auth'
import { changeProfile } from '@/api/users'

const auth = useAuthStore()

const { user } = storeToRefs(auth)

const currentSection = ref<'profile' | 'account' | 'security'>('profile')

const loading = ref(false)
const success = ref<string | null>(null)
const error = ref<string | null>(null)

const profileForm = ref({
  fullName: user.value?.fullName ?? '',
  avatarUrl: user.value?.avatarUrl ?? '',
})

const accountForm = ref({
  email: user.value?.email ?? '',
})

const securityForm = ref({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
})

const passwordMismatch = computed(() => {
  return (
    securityForm.value.confirmPassword.length > 0 &&
    securityForm.value.newPassword !== securityForm.value.confirmPassword
  )
})

const saveProfile = async () => {
  try {
    loading.value = true
    error.value = null
    success.value = null

    await changeProfile(profileForm.value)

    success.value = 'Profile updated successfully'
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

const saveAccount = async () => {
  try {
    loading.value = true

    console.log('SAVE ACCOUNT', accountForm.value)
  } finally {
    loading.value = false
  }
}

const savePassword = async () => {
  if (passwordMismatch.value) return

  try {
    loading.value = true
    error.value = null
    success.value = null

    await changePassword(securityForm.value)

    success.value = 'Password changed successfully'

    securityForm.value.currentPassword = ''
    securityForm.value.newPassword = ''
    securityForm.value.confirmPassword = ''
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Something went wrong'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="settings-page">
    <div class="settings-layout">
      <aside class="sidebar">
        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'profile' }"
          @click="currentSection = 'profile'"
        >
          Edit Profile
        </button>

        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'account' }"
          @click="currentSection = 'account'"
        >
          Account
        </button>

        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'security' }"
          @click="currentSection = 'security'"
        >
          Security
        </button>
      </aside>

      <section class="content">
        <div v-if="currentSection === 'profile'" class="card">
          <h2>Edit profile</h2>

          <div class="form-group">
            <label>Username</label>

            <input v-model="profileForm.fullName" type="text" />
          </div>

          <div class="form-group">
            <label>Avatar URL</label>

            <input v-model="profileForm.avatarUrl" type="text" />
          </div>

          <div class="preview">
            <img :src="profileForm.avatarUrl" alt="Avatar preview" />
          </div>

          <p v-if="success" class="success">
            {{ success }}
          </p>

          <p v-if="error" class="error">
            {{ error }}
          </p>

          <button class="save-btn" :disabled="loading" @click="saveProfile">
            {{ loading ? 'Saving...' : 'Save changes' }}
          </button>
        </div>

        <div v-if="currentSection === 'account'" class="card">
          <h2>Account settings</h2>

          <div class="form-group">
            <label>Email</label>

            <input v-model="accountForm.email" type="email" />
          </div>

          <button class="save-btn" :disabled="loading" @click="saveAccount">
            {{ loading ? 'Saving...' : 'Update email' }}
          </button>
        </div>

        <div v-if="currentSection === 'security'" class="card">
          <h2>Security</h2>

          <div class="form-group">
            <label>Current password</label>

            <input v-model="securityForm.currentPassword" type="password" />
          </div>

          <div class="form-group">
            <label>New password</label>

            <input v-model="securityForm.newPassword" type="password" />
          </div>

          <div class="form-group">
            <label>Confirm password</label>

            <input v-model="securityForm.confirmPassword" type="password" />
          </div>

          <p v-if="passwordMismatch" class="error">Passwords do not match</p>

          <p v-if="success" class="success">
            {{ success }}
          </p>

          <p v-if="error" class="error">
            {{ error }}
          </p>

          <button class="save-btn" :disabled="loading || passwordMismatch" @click="savePassword">
            {{ loading ? 'Saving...' : 'Change password' }}
          </button>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.settings-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #0b0f17;
}

.settings-layout {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;

  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
}

.sidebar {
  height: fit-content;

  position: sticky;
  top: 1rem;
  z-index: 20;

  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  padding: 1rem;

  border-radius: 16px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.sidebar-btn {
  width: 100%;

  border: none;

  text-align: left;

  padding: 0.9rem 1rem;

  border-radius: 10px;

  background: transparent;

  color: rgba(255, 255, 255, 0.7);

  font-size: 0.95rem;
  font-family: 'Merriweather', sans-serif;

  cursor: pointer;

  transition: 0.2s;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-btn.active {
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.4);
  color: white;
}

.content {
  display: flex;
  flex-direction: column;
}

.card {
  padding: 1.5rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
}

.card h2 {
  margin-bottom: 1.5rem;

  font-size: 1.8rem;

  font-family: 'Bebas Neue', sans-serif;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 0.5rem;

  margin-bottom: 1.25rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.7);

  font-size: 0.95rem;
}

.form-group input {
  width: 100%;

  padding: 0.85rem 1rem;

  border-radius: 10px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  background: rgba(255, 255, 255, 0.05);

  color: white;

  font-size: 1rem;

  box-sizing: border-box;

  outline: none;

  transition: 0.2s;
}

.form-group input:focus {
  border-color: rgba(59, 130, 246, 0.7);
}

.preview {
  margin-bottom: 1.5rem;
}

.preview img {
  width: 120px;
  height: 120px;

  border-radius: 50%;

  object-fit: cover;

  border: 2px solid rgba(255, 255, 255, 0.1);
}

.save-btn {
  border: none;

  padding: 0.9rem 1.4rem;

  border-radius: 10px;

  background: rgba(59, 130, 246, 0.85);

  color: white;

  font-size: 0.95rem;
  font-family: 'Merriweather', sans-serif;

  cursor: pointer;

  transition: 0.2s;
}

.save-btn:hover:not(:disabled) {
  background: rgba(59, 130, 246, 1);
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error {
  color: rgb(248, 113, 113);

  margin-bottom: 1rem;
}

.success {
  color: rgb(34, 197, 94);
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .settings-layout {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .sidebar {
    position: sticky;

    display: grid;
    grid-template-columns: repeat(3, 1fr);

    width: 100%;

    padding: 0.4rem;
    gap: 0.5rem;

    overflow: visible;
  }

  .sidebar-btn {
    width: 100%;

    min-width: 0;

    white-space: nowrap;

    text-align: center;

    padding: 0.8rem 0.5rem;

    font-size: 0.85rem;
  }

  .card {
    padding: 1rem;
    border-radius: 14px;
  }

  .card h2 {
    font-size: 1.5rem;
  }

  .form-group input {
    padding: 0.8rem 0.9rem;
    font-size: 0.95rem;
  }

  .preview {
    display: flex;
    justify-content: center;
  }

  .preview img {
    width: 96px;
    height: 96px;
  }

  .save-btn {
    width: 100%;
  }
}
</style>
