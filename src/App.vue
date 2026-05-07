<script setup lang="ts">
import TheHeader from './components/TheHeader.vue'
import TheFooter from './components/TheFooter.vue'

import { RouterView } from 'vue-router'

const menu = [
  { label: 'Home', href: '/' },
  { label: 'Articles', href: '/articles' },
]
</script>

<template>
  <div class="layout">
    <TheHeader :menu="menu" />

    <main class="page">
      <RouterView />
    </main>

    <TheFooter />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.page {
  flex: 1;
  padding-bottom: 2rem;
}
</style>
