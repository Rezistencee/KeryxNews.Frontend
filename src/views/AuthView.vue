<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const isLogin = ref(true)

const email = ref('')
const fullName = ref('')
const password = ref('')
const confirmPassword = ref('')

const error = ref('')

const toggleMode = () => {
  isLogin.value = !isLogin.value
}

const handleSubmit = async () => {
  error.value = ''

  try {
    if (!isLogin.value) {
      if (password.value !== confirmPassword.value) {
        error.value = 'Passwords do not match'
        return
      }

      await auth.register(email.value, fullName.value, password.value)
    } else {
      await auth.login(email.value, password.value)
    }

    router.push('/')
  } catch (err: any) {
    error.value = err?.response?.data || 'Authentication failed'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-card">
      <h2>{{ isLogin ? 'Login' : 'Register' }}</h2>

      <form class="auth-form" @submit.prevent="handleSubmit">
        <input v-model="email" type="email" placeholder="Email" required />

        <input v-model="fullName" v-if="!isLogin" type="text" placeholder="Fullname" required />

        <input v-model="password" type="password" placeholder="Password" required />

        <input
          v-model="confirmPassword"
          v-if="!isLogin"
          type="password"
          placeholder="Confirm password"
          required
        />

        <button class="btn submit" :disabled="auth.loading">
          {{ auth.loading ? 'Loading...' : isLogin ? 'Login' : 'Create account' }}
        </button>
      </form>

      <p class="switch">
        {{ isLogin ? 'Don`t have an account?' : 'Already have an account?' }}
        <span @click="toggleMode">
          {{ isLogin ? 'Sign up' : 'Sign in' }}
        </span>
      </p>
      <button type="button" class="google-btn" @click="auth.loginWithGoogle()">
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" />

        Continue with Google
      </button>
      <p v-if="error" class="error">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #0b0f17;
  padding: 2rem;
}

.auth-card {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 420px;
  color: #fff;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.auth-card h2 {
  font-family: 'Bebas Neue', sans-serif;
  text-align: center;
  margin-bottom: 1.8rem;
  font-size: 1.6rem;
  letter-spacing: 0.5px;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.auth-form input {
  padding: 0.85rem 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(15, 23, 42, 0.8);
  color: #fff;
  outline: none;
  transition: all 0.2s ease;
  font-family: 'Merriweather', sans-serif;
  font-size: 0.95rem;
}

.auth-form input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.auth-form input:focus {
  border-color: #ff4d6d;
  box-shadow: 0 0 0 3px rgba(255, 77, 109, 0.2);
  transform: translateY(-1px);
}

.submit {
  margin-top: 0.5rem;
  padding: 0.9rem;
  border-radius: 10px;
  border: none;
  cursor: pointer;

  font-weight: 700;
  font-size: 1rem;
  color: #0b0f17;

  background: linear-gradient(135deg, #ff4d6d, #b3123f);
  transition: all 0.2s ease;
  box-shadow: 0 10px 25px rgba(255, 77, 109, 0.25);

  font-family: 'Merriweather', sans-serif;
}

.submit:hover {
  transform: translateY(-2px);
  box-shadow: 0 15px 35px rgba(255, 77, 109, 0.35);
}

.submit:active {
  transform: translateY(0px);
}

.switch {
  font-family: 'Merriweather', sans-serif;
  margin-top: 1.2rem;
  text-align: center;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
}

.switch span {
  color: #6ee7ff;
  cursor: pointer;
  margin-left: 6px;
  font-weight: 600;
  transition: 0.2s;
}

.switch span:hover {
  color: #8aa4ff;
  text-decoration: underline;
}

.google-btn {
  margin-top: 0.5rem;

  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.7rem;

  width: 100%;

  padding: 0.9rem;

  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  background: rgba(255, 255, 255, 0.05);

  color: white;

  cursor: pointer;

  transition: 0.2s ease;

  font-family: 'Merriweather', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
}

.google-btn img {
  width: 20px;
  height: 20px;
}

.google-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.error {
  margin-top: 1rem;
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
}
</style>
