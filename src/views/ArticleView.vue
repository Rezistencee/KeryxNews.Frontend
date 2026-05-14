<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import type { Article } from '@/types/article'
import { getArticleById } from '@/api/articles.service'
import { formatDate } from '@/utils/formatDate'
import CommentComponent from '@/components/CommentComponent.vue'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const auth = useAuthStore()
const article = ref<Article | null>(null)

const commentText = ref('')

const readingTime = computed(() => {
  if (!article.value?.content) return 1

  const WPM = 160

  const words = article.value.content.trim().split(/\s+/).length
  const minutes = Math.ceil(words / WPM)

  return minutes
})

const comments = [
  {
    id: 1,
    author: 'John Doe',
    text: 'This is a great article, really enjoyed the writing style!',
    createdAt: new Date(),
    avatarUrl: null,
  },
  {
    id: 2,
    author: 'Anna Smith',
    text: 'I learned something new today. Thanks for sharing!',
    createdAt: new Date(),
    avatarUrl: 'https://i.pravatar.cc/150?img=47',
  },
  {
    id: 3,
    author: 'Alex Johnson',
    text: 'Would love to see more posts like this one.',
    createdAt: new Date(),
    avatarUrl: 'https://i.pravatar.cc/150?img=12',
  },
]

onMounted(async () => {
  const id = route.params.id as string
  article.value = await getArticleById(id)
})
</script>

<template>
  <div class="article-page" v-if="article">
    <div class="hero" :style="{ backgroundImage: `url(${article.imageUrl})` }">
      <div class="hero__overlay">
        <h1>{{ article.title }}</h1>
      </div>
    </div>

    <div class="meta">
      <span class="meta-item">
        {{ formatDate(article.createdAt) }}
      </span>

      <span class="meta-item">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M2 12C4.5 7 8.5 5 12 5C15.5 5 19.5 7 22 12C19.5 17 15.5 19 12 19C8.5 19 4.5 17 2 12Z"
            stroke="currentColor"
            stroke-width="2"
          />
          <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" />
        </svg>
        <p>{{ article.views }}</p>
      </span>

      <span class="meta-item">
        <svg
          width="20"
          height="20"
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
        <p>{{ comments.length }}</p>
      </span>

      <span class="meta-item"> {{ readingTime }} min read </span>
    </div>

    <div class="content">
      <div class="content-text" v-html="article.content"></div>
    </div>

    <div class="comments">
      <h2 class="comments-title">{{ comments.length }} Comments</h2>

      <div v-if="!auth.isAuthenticated" class="auth-comment-banner">
        You need to be logged in to post a comment.
      </div>

      <div v-else class="comment-form">
        <textarea v-model="commentText" placeholder="Write a comment..." rows="3" />

        <button>Post comment</button>
      </div>

      <CommentComponent
        v-for="c in comments"
        :key="c.id"
        :author="c.author"
        :text="c.text"
        :created-at="c.createdAt"
        :avatar-url="c.avatarUrl"
      />
    </div>
  </div>
</template>

<style scoped>
.article-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
  color: white;
}

.hero {
  height: 420px;
  border-radius: 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  position: relative;
  margin-bottom: 1.5rem;
}

.hero__overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 2rem;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent);
  box-sizing: border-box;
}

.hero__overlay h1 {
  font-size: 2rem;
  font-family: 'Merriweather', serif;
}

.meta {
  display: flex;
  gap: 16px;
  align-items: center;
  opacity: 0.8;
  font-size: 14px;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #fff;
  font-family: 'Merriweather', serif;
  font-size: 1rem;
}

.content {
  font-size: 18px;
  line-height: 1.8;
  font-family: 'Merriweather', serif;
  text-align: justify;
}

.content-text {
  white-space: pre-wrap;
}

.comments {
  margin-top: 3rem;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.comments-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  font-family: 'Bebas Neue', sans-serif;
}

.comment-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 1rem;
}

textarea {
  background: #111;
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px;
  border-radius: 8px;
  font-family: inherit;
  resize: none;
}

button {
  width: fit-content;
  padding: 8px 14px;
  background: white;
  color: black;
  border-radius: 8px;
  cursor: pointer;
  border: none;
  font-weight: 500;
}

.auth-comment-banner {
  box-sizing: border-box;

  margin-top: 0.75rem;
  margin-bottom: 1rem;

  padding: 1rem 1.2rem;

  border-radius: 14px;

  background: rgba(245, 158, 11, 0.12);
  border: 1px solid rgba(245, 158, 11, 0.35);

  color: rgba(253, 230, 138, 1);

  font-family: 'Merriweather', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;

  backdrop-filter: blur(8px);
}
</style>
