<script setup lang="ts">
const currentYear: number = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <p>All rights reserved © {{ currentYear }}</p>
  </footer>
</template>

<style scoped>
.footer {
  background: transparent;
  color: #f5f5f5;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 1.5rem 1rem;
  text-align: center;
  font-size: 14px;

  border-top: 1px solid var(--color-border);
}

.footer p {
  margin: 0;

  font-weight: 600;
  font-size: 14pt;
  letter-spacing: 0.1em;
}
</style>
