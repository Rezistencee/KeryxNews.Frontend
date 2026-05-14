<script setup lang="ts">
import { formatDate } from '@/utils/formatDate'

type Props = {
  author: string
  text: string
  createdAt: Date | string
  avatarUrl?: string | null
}

const props = defineProps<Props>()

const initials = props.author
  .split(' ')
  .map((w) => w[0])
  .slice(0, 2)
  .join('')
  .toUpperCase()
</script>

<template>
  <div class="comment">
    <div class="comment__header">
      <div class="author-block">
        <div class="avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
          <span v-else>{{ initials }}</span>
        </div>

        <span class="author">{{ author }}</span>
      </div>

      <span class="date">{{ formatDate(createdAt as string) }}</span>
    </div>

    <p class="text">{{ text }}</p>
  </div>
</template>

<style scoped>
.comment {
  padding: 12px 14px;
  border-radius: 10px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  color: white;
}

.comment__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.author-block {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 600;
  color: white;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.author {
  font-weight: 500;
  font-size: 0.95rem;
}

.date {
  font-size: 0.75rem;
  opacity: 0.6;
}

.text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}
</style>
