<script setup lang="ts">
import { ref } from 'vue'
import { formatDate } from '@/utils/formatDate'

import type { User } from '@/types/user'

const user = ref<User>({
  username: 'Rezistence',
  avatarUrl: 'https://i.pinimg.com/736x/46/ab/15/46ab15d5d0cefcf79826163694b03204.jpg',
  createdAt: '2026-05-02',
})

const roles = ref([
  { name: 'Admin', type: 'admin' },
  { name: 'Author', type: 'author' },
  { name: 'User', type: 'user' },
])
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <img :src="user.avatarUrl" alt="User avatar" class="avatar" />

      <div class="info">
        <h2 class="username">{{ user.username }}</h2>
        <p class="registered">Member since: {{ formatDate(user.createdAt) }}</p>

        <div class="chips">
          <span v-for="role in roles" :key="role.name" class="chip" :class="role.type">
            {{ role.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  justify-content: center;
  padding-top: 2rem;
  background: #0b0f17;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;

  width: 100%;
  max-width: 960px;

  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-radius: 16px;
  padding: 1.25rem;
  color: white;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;

  border: 2px solid rgba(255, 255, 255, 0.1);
}

.username {
  font-family: 'Merriweather', sans-serif;
  font-size: 1.6rem;
  font-weight: bold;
}

.registered {
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.6);
}

.chips {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 100px;
  font-family: 'Merriweather', sans-serif;
  font-size: 0.8rem;
  transition: 0.2s;
}

.chip.admin {
  background: rgba(239, 68, 68, 0.25);
  border: 1px solid rgba(239, 68, 68, 0.4);
}

.chip.author {
  background: rgba(59, 130, 246, 0.25);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.chip.user {
  background: rgba(34, 197, 94, 0.25);
  border: 1px solid rgba(34, 197, 94, 0.4);
}
</style>
