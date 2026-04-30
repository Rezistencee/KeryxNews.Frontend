<script setup lang="ts">
const menu = ['Home', 'Articles']
</script>

<template>
  <header class="header">
    <div class="header__left">
      <img src="../assets/logo.png" alt="Logo" class="logo" />
    </div>

    <nav class="header__center">
      <a v-for="item in menu" :key="item" href="#">
        {{ item }}
      </a>
    </nav>

    <div class="header__right">
      <button class="btn auth">Login / Register</button>
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
  font-weight: 600;
  font-size: 18pt;
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
  font-weight: bold;
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    row-gap: 1rem;
    text-align: center;
  }

  .header__left,
  .header__center,
  .header__right {
    justify-content: center;
  }

  .header__center {
    flex-direction: column;
    gap: 0.8rem;
  }

  .header__center a {
    display: block;
  }

  .logo {
    width: 72px;
    height: 72px;
  }
}
</style>
