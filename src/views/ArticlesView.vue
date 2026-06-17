<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import type { Article } from '@/types/article'
import { getLatest } from '@/api/articles.service'
import { useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import { watchDebounced } from '@vueuse/core'

const router = useRouter()

const articles = ref<Article[]>([])

const { page, pageSize, totalPages, setTotal, nextPage, prevPage } = usePagination(1, 10)

const search = ref('')

const selectedSort = ref('Date')

const sortOptions = [
  {
    label: 'Newest',
    value: 'Date',
  },
  {
    label: 'Most Viewed',
    value: 'Views',
  },
]

const loadArticles = async () => {
  const response = await getLatest(page.value, pageSize, search.value, selectedSort.value)

  articles.value = response.items
  setTotal(response.meta.total)
}

const openArticle = (id: string) => {
  router.push(`/articles/${id}`)
}

watch(page, loadArticles)

watchDebounced(
  search,
  () => {
    page.value = 1
    loadArticles()
  },
  {
    debounce: 750,
    maxWait: 1000,
  },
)

watch(selectedSort, () => {
  page.value = 1
  loadArticles()
})

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
          v-for="sort in sortOptions"
          :key="sort.value"
          :class="{ active: selectedSort === sort.value }"
          @click="selectedSort = sort.value"
        >
          {{ sort.label }}
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
