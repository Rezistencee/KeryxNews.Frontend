<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

import { RouterView } from 'vue-router'

const menu = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
  { label: 'Profile', href: '/profile' },
]
</script>

<template>
  <TheHeader :menu="menu" />

  <main>
    <RouterView />
  </main>

  <TheFooter />
</template>

<style scoped></style>
