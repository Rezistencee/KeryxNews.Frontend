<script setup lang="ts">
import { computed } from 'vue'
import { formatDate } from '@/utils/formatDate'
import { useAuthStore } from '@/stores/auth'
import { useDisclosure } from '@/composables/useDisclosure'
import ReportCommentModal from './modals/ReportCommentModal.vue'

type Props = {
  commentId: string
  author: string
  authorId?: string
  text: string
  createdAt: Date | string
  avatarUrl?: string | null
}

const props = defineProps<Props>()

const auth = useAuthStore()
const reportModal = useDisclosure()

const initials = props.author
  .split(' ')
  .map((w) => w[0])
  .slice(0, 2)
  .join('')
  .toUpperCase()

const canReport = computed(() => {
  return auth.user?.id && auth.user.id !== props.authorId
})

const onReport = () => {
  reportModal.open()
}
</script>

<template>
  <div class="comment">
    <div class="comment__header">
      <div class="author-block">
        <div class="avatar">
          <img v-if="avatarUrl" :src="avatarUrl" alt="avatar" />
          <span v-else>{{ initials }}</span>
        </div>

        <router-link v-if="authorId" :to="`/profile/${authorId}`" class="author">
          {{ author }}
        </router-link>

        <span v-else class="author">
          {{ author }}
        </span>
      </div>

      <div class="right-side">
        <span class="date">
          {{ formatDate(createdAt as string) }}
        </span>

        <span v-if="canReport" class="report-chip" @click="onReport"> Report </span>
      </div>
    </div>

    <p class="text">{{ text }}</p>
  </div>

  <ReportCommentModal
    v-if="reportModal.isOpen.value"
    :comment-id="props.commentId"
    @close="reportModal.close"
  />
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

.right-side {
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
  color: white;
  text-decoration: none;
}

.author:hover {
  opacity: 0.8;
}

.date {
  font-size: 0.75rem;
  opacity: 0.6;
}

.report-chip {
  display: inline-flex;
  align-items: center;

  font-size: 0.7rem;
  font-weight: 600;

  padding: 4px 10px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);

  color: rgba(255, 255, 255, 0.75);

  cursor: pointer;
  transition: 0.25s;
}

.report-chip:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.4);
  color: rgba(239, 68, 68, 1);
}

.text {
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}
</style>
