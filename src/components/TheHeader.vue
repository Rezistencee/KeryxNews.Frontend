<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

interface MenuItem {
  label: string
  href: string
}

defineProps<{
  menu: MenuItem[]
}>()

const isOpen = ref(false)

const toggleMenu = () => {
  isOpen.value = !isOpen.value
}

const closeMenu = () => {
  isOpen.value = false
}
</script>

<template>
  <header class="header">
    <div class="header__left">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <nav class="header__center">
      <RouterLink v-for="item in menu" :key="item.href" :to="item.href" @click="closeMenu">
        {{ item.label }}
      </RouterLink>
    </nav>

    <button class="burger" @click="toggleMenu">
      <svg v-if="!isOpen" width="28" height="28" viewBox="0 0 24 24" fill="none">
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

    <div class="header__right">
      <RouterLink to="/auth" class="btn auth">Login / Register</RouterLink>
    </div>

    <div class="mobile-menu" :class="{ open: isOpen }">
      <button class="close-btn" @click="closeMenu">✕</button>

      <nav class="mobile-menu__nav">
        <RouterLink v-for="item in menu" :key="item.href" :to="item.href" @click="closeMenu">
          {{ item.label }}
        </RouterLink>
      </nav>

      <RouterLink to="/auth" class="btn mobile-btn">Login / Register</RouterLink>
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
    grid-template-columns: 1fr auto;
  }

  .header__center,
  .header__right {
    display: none;
  }

  .burger {
    display: block;
    justify-self: end;
  }

  .header__left {
    justify-self: start;
  }

  .logo {
    height: 56px;
  }
}
</style>
