<script setup lang="ts">
import type { Article } from '@/types/article'

const props = defineProps<{
  article: Article
  submitting?: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', id: string): void
  (e: 'open', id: string): void
}>()

const statusTextMap: Record<string, string> = {
  Draft: '',
  PendingReview: 'In review',
  Rejected: 'Rejected',
  Approved: 'Published',
}

const getStatusText = (status: string) => statusTextMap[status] ?? status

const onSubmit = () => {
  emit('submit', props.article.id)
}

const onOpen = () => {
  emit('open', props.article.id)
}
</script>

<template>
  <div class="card" @click="onOpen">
    <div class="top">
      <h3>{{ article.title }}</h3>

      <span class="badge" :class="article.status">
        {{ article.status }}
      </span>
    </div>

    <p class="excerpt">{{ article.content.slice(0, 120) }}...</p>

    <div class="bottom">
      <div class="meta" v-if="article.status === 'Approved'">
        <span class="views">
          <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2 12C4.5 7 8.5 5 12 5C15.5 5 19.5 7 22 12C19.5 17 15.5 19 12 19C8.5 19 4.5 17 2 12Z"
              stroke="currentColor"
              stroke-width="2"
            />
            <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
          </svg>

          {{ article.views }}
        </span>

        <span
          ><svg
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 4H20V14H7L4 17V4Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linejoin="round"
            />
          </svg>
          {{ article.commentsCount }}</span
        >
      </div>

      <div class="actions" @click.stop>
        <button v-if="article.status === 'Draft'" :disabled="submitting" @click="onSubmit">
          {{ submitting ? 'Submitting...' : 'Submit' }}
        </button>

        <span class="hint">
          {{ getStatusText(article.status) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  position: relative;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1rem;
  transition: 0.25s;
  cursor: pointer;
  overflow: hidden;

  display: flex;
  flex-direction: column;
}

.card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top left, rgba(59, 130, 246, 0.15), transparent 60%);
  opacity: 0;
  transition: 0.3s;
  pointer-events: none;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(59, 130, 246, 0.4);
}

.card:hover::before {
  opacity: 1;
}

.top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;
}

h3 {
  font-size: 1.05rem;
  margin: 0;
  color: white;
}

.excerpt {
  opacity: 0.7;
  font-size: 0.85rem;
  margin: 0.8rem 0;
  line-height: 1.4;
}

.bottom {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  opacity: 0.7;
}

.views {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  opacity: 0.7;
}

.icon {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

button {
  background: #3b82f6;
  border: none;
  color: white;
  padding: 0.35rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: 0.2s;
}

button:hover {
  background: #2563eb;
}

button:disabled {
  opacity: 0.5;
}

.hint {
  font-size: 0.75rem;
  opacity: 0.6;
}

.badge {
  font-size: 0.7rem;
  padding: 4px 10px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.badge.Draft {
  color: #94a3b8;
  border-color: #94a3b8;
  background: rgba(148, 163, 184, 0.12);
}

.badge.PendingReview {
  color: #fbbf24;
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.12);
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.15);
  animation: pulse 2s infinite;
}

.badge.Rejected {
  color: #ef4444;
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.badge.Approved {
  color: #22c55e;
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.12);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.15);
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 rgba(251, 191, 36, 0.2);
  }
  50% {
    box-shadow: 0 0 20px rgba(251, 191, 36, 0.35);
  }
  100% {
    box-shadow: 0 0 0 rgba(251, 191, 36, 0.2);
  }
}
</style>
