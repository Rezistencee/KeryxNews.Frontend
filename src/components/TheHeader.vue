<script setup lang="ts">
import { useDisclosure } from '@/composables/useDisclosure'
import { useAuthStore } from '@/stores/auth'
import { RouterLink } from 'vue-router'

interface MenuItem {
  label: string
  href: string
}

defineProps<{
  menu: MenuItem[]
}>()

const auth = useAuthStore()

const mobileMenu = useDisclosure()
const profileMenu = useDisclosure()
</script>

<template>
  <header class="header">
    <div class="header__left">
      <button class="burger" @click="mobileMenu.toggle">
        <svg v-if="!mobileMenu.isOpen.value" width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6H20M4 12H20M4 18H20"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>

        <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none">
          <path
            d="M6 6L18 18M6 18L18 6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <nav class="header__center">
      <RouterLink v-for="item in menu" :key="item.href" :to="item.href">
        {{ item.label }}
      </RouterLink>
    </nav>

    <div class="header__right">
      <button class="icon-btn">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21L16.65 16.65M11 18A7 7 0 1 1 11 4a7 7 0 0 1 0 14Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div
        v-if="auth.isAuthenticated"
        class="user-wrapper"
        :class="{ open: profileMenu.isOpen.value }"
        @click="profileMenu.toggle"
      >
        <div class="user">
          <img :src="auth.user?.avatarUrl" loading="lazy" class="avatar" />

          <span class="arrow">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>

        <div class="dropdown" v-if="profileMenu.isOpen.value" @click.stop>
          <RouterLink :to="`/profile/${auth.user?.id}`" @click="profileMenu.close"
            >Profile</RouterLink
          >
          <RouterLink to="/settings" @click="profileMenu.close">Settings</RouterLink>
          <button @click="profileMenu.close">Logout</button>
        </div>
      </div>

      <div v-else class="auth-buttons">
        <RouterLink to="/auth" class="auth-btn"> Login / Register </RouterLink>
      </div>
    </div>

    <div class="mobile-menu" :class="{ open: mobileMenu.isOpen.value }">
      <button class="close-btn" @click="mobileMenu.close">✕</button>

      <nav class="mobile-menu__nav">
        <RouterLink v-for="item in menu" :key="item.href" :to="item.href" @click="mobileMenu.close">
          {{ item.label }}
        </RouterLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.header__left {
  display: flex;
  justify-content: flex-start;
}

.logo {
  height: 72px;
}

.header__center {
  display: flex;
  justify-content: center;
  gap: 2rem;
}

.header__center a {
  text-decoration: none;
  color: var(--color-text);
  font-size: 18pt;
  font-weight: 600;
  font-family: 'Merriweather', sans-serif;
}

.header__right {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn {
  padding: 0.4rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  border: 1px solid var(--color-border);
  background: linear-gradient(135deg, #8aa4ff, #6ee7ff);
  font-family: 'Merriweather', sans-serif;
  font-weight: bold;
  color: #1e1e1e;
  text-decoration: none;
  text-align: center;
}

.icon-btn {
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
}

.auth-buttons {
  display: flex;
  align-items: center;
}

.auth-btn {
  padding: 0.55rem 1.2rem;
  border-radius: 10px;
  text-decoration: none;
  font-family: 'Merriweather', sans-serif;
  font-weight: 700;
  font-size: 14px;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    background 0.2s ease;

  color: #ff4d6d;
  border: 1px solid #ff4d6d;
  background: transparent;
}

.auth-btn:hover {
  background: rgba(255, 77, 109, 0.12);
  transform: translateY(-1px);
}

.user {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  text-decoration: none;
  color: white;
}

.user:hover {
  background-color: transparent;
}

.user-wrapper {
  position: relative;
  cursor: pointer;
}

.arrow {
  display: flex;
  align-items: center;
  transition: transform 0.2s ease;
}

.user-wrapper.open .arrow {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  top: 120%;
  right: 0;

  background: #2a2a2a;
  border: 1px solid var(--color-border);
  border-radius: 8px;

  display: flex;
  flex-direction: column;
  min-width: 160px;

  padding: 0.5rem 0;
  z-index: 100;
}

.dropdown a,
.dropdown button {
  padding: 0.6rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: white;
  text-decoration: none;
  font-family: 'Merriweather', sans-serif;
  text-align: center;
  cursor: pointer;
  font-size: 14px;
}

.dropdown a:hover,
.dropdown button:hover {
  background: rgba(255, 255, 255, 0.08);
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid #ff4d6d;
  object-fit: cover;
  box-shadow: 0 10px 20px rgba(255, 77, 109, 0.35);
}

.burger {
  display: none;
  font-size: 28px;
  background: none;
  border: none;
  cursor: pointer;
  color: white;
}

.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  background: #1e1e1e;

  transform: translateY(-100%);
  transition: transform 0.3s ease;

  z-index: 1000;

  display: flex;
  flex-direction: column;
  align-items: center;

  padding: 2rem 1rem;
  gap: 1.5rem;
}

.mobile-menu.open {
  transform: translateY(0);
}

.mobile-menu__nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  text-align: center;
}

.mobile-menu__nav a {
  color: #f5f5f5;
  font-size: 20px;
  text-decoration: none;
  font-weight: 600;
}

.mobile-btn {
  width: 80%;
}

.close-btn {
  position: absolute;
  right: 1rem;
  top: 1rem;

  font-size: 24px;
  background: none;
  border: none;
  color: #f5f5f5;
  cursor: pointer;
}

@media (max-width: 768px) {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
  }

  .header__left {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  .header__center {
    display: none;
  }

  .header__right {
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  .burger {
    display: block;
  }

  .logo {
    height: 48px;
  }
}
</style>
