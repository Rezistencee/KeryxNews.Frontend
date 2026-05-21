<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import type { Article } from '@/types/article'
import { getLatest } from '@/api/articles.service'
import { useRouter } from 'vue-router'

const router = useRouter()

const articles = ref<Article[]>([])

const page = ref(1)
const pageSize = 2

const total = ref(0)
const totalPages = ref(1)

const search = ref('')

const selectedPlatform = ref('All')

const platforms = ['All', 'PC', 'PS5', 'Xbox']

const loadArticles = async () => {
  try {
    const response = await getLatest(page.value, pageSize)

    articles.value = response.items

    total.value = response.meta.total

    totalPages.value = Math.ceil(total.value / pageSize)
  } catch (error) {
    console.error(error)
  }
}

const openArticle = (id: string) => {
  router.push(`/articles/${id}`)
}

const nextPage = () => {
  if (page.value < totalPages.value) {
    page.value++
  }
}

const prevPage = () => {
  if (page.value > 1) {
    page.value--
  }
}

watch(page, loadArticles)

onMounted(loadArticles)
</script>

<template>
  <div class="articles-page">
    <div class="articles-page__header">
      <h1>All articles</h1>

      <p>Page {{ page }} / {{ totalPages }}</p>
    </div>

    <div class="filters">
      <input v-model="search" type="text" placeholder="Search article..." class="search-input" />

      <div class="platforms">
        <button
          v-for="platform in platforms"
          :key="platform"
          :class="{ active: selectedPlatform === platform }"
          @click="selectedPlatform = platform"
        >
          {{ platform }}
        </button>
      </div>
    </div>

    <div class="articles-list">
      <NewsCard
        v-for="article in articles"
        :key="article.id"
        :title="article.title"
        :description="article.content"
        :imageUrl="article.imageUrl"
        :views="article.views"
        :comments="article.commentsCount"
        @click="openArticle(String(article.id))"
      />
    </div>

    <div class="pagination">
      <button :disabled="page === 1" @click="prevPage">Previous</button>

      <button :disabled="page === totalPages" @click="nextPage">Next</button>
    </div>
  </div>
</template>

<style scoped>
.articles-page {
  width: 960px;
  max-width: 100%;
  margin: 0 auto;
  padding: 1rem;
  box-sizing: border-box;
}

.articles-page__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.articles-page__header h1 {
  color: white;
  font-family: 'Bebas Neue', sans-serif;
}

.articles-page__header p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14pt;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  margin-bottom: 1rem;
}

.search-input,
.tag-select {
  background: #1f2937;
  border: 1px solid #374151;
  color: white;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
}

.search-input {
  flex: 1;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.platforms {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.platforms button {
  background: #1f2937;
  border: 1px solid #374151;
  color: white;
  padding: 8px 14px;
  border-radius: 999px;
  cursor: pointer;
}

.platforms button.active {
  background: #2563eb;
  border-color: #2563eb;
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.pagination button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #34495e;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .filters {
    flex-direction: column;
  }

  .tag-select {
    width: 100%;
  }

  .articles-page__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
