<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import { getMyArticles, submitArticle } from '@/api/articles.service'
import AuthorArticleCard from '@/components/AuthorArticleCard.vue'
import { useDisclosure } from '@/composables/useDisclosure'
import CreateArticleModal from '@/components/modals/CreateArticleModal.vue'
import EditArticleModal from '@/components/modals/EditArticleModal.vue'
import ArticleViewsChart from '@/components/ArticleViewsChart.vue'

const createModal = useDisclosure()
const editModal = useDisclosure()

const articles = ref<Article[]>([])
const loading = ref(false)

const submittingId = ref<string | null>(null)

const filters = ['All', 'Draft', 'PendingReview', 'Approved'] as const

type Filter = (typeof filters)[number]

const selectedFilter = ref<Filter>('All')

const editingArticle = ref<Article | null>(null)

const load = async () => {
  loading.value = true
  try {
    articles.value = await getMyArticles()
  } finally {
    loading.value = false
  }
}

const filteredArticles = computed(() => {
  if (selectedFilter.value === 'All') return articles.value

  return articles.value.filter((a) => a.status === selectedFilter.value)
})

const submitForReview = async (id: string) => {
  submittingId.value = id

  try {
    await submitArticle(id)

    await load()
  } finally {
    submittingId.value = null
  }
}

const openArticle = (id: string) => {
  const article = articles.value.find((a) => a.id === id)

  if (!article) return

  if (article.status !== 'Draft') return

  editingArticle.value = article

  editModal.open()
}

const approvedArticles = computed(() =>
  articles.value.filter((article) => article.status === 'Approved'),
)

const totalViews = computed(() =>
  approvedArticles.value.reduce((sum, article) => sum + article.views, 0),
)

const totalComments = computed(() =>
  approvedArticles.value.reduce((sum, article) => sum + article.commentsCount, 0),
)

const averageViews = computed(() =>
  approvedArticles.value.length ? Math.round(totalViews.value / approvedArticles.value.length) : 0,
)

onMounted(load)
</script>

<template>
  <div class="page">
    <CreateArticleModal
      v-if="createModal.isOpen.value"
      @close="createModal.close"
      @created="load"
    />

    <EditArticleModal
      v-if="editModal.isOpen.value && editingArticle"
      :article="editingArticle"
      @close="editModal.close"
      @updated="load"
    />

    <div class="header">
      <div>
        <h1>My Articles</h1>
        <p>Manage your drafts and publications</p>
      </div>

      <button class="create-btn" @click="createModal.open">+ Create Article</button>
    </div>

    <div class="filters">
      <button
        v-for="f in filters"
        :key="f"
        :class="{ active: selectedFilter === f }"
        @click="selectedFilter = f"
      >
        {{ f }}
      </button>
    </div>

    <div v-if="loading" class="loading">Loading articles...</div>

    <div v-else class="grid">
      <AuthorArticleCard
        v-for="article in filteredArticles"
        :key="article.id"
        :article="article"
        :submitting="submittingId === article.id"
        @submit="submitForReview"
        @open="openArticle"
      />
    </div>
  </div>

  <div v-if="approvedArticles.length" class="analytics-section">
    <h2>Article Analytics</h2>

    <div class="stats-grid">
      <div class="stat-card">
        <span class="stat-label">Published Articles</span>
        <strong>{{ approvedArticles.length }}</strong>
      </div>

      <div class="stat-card">
        <span class="stat-label">Total Views</span>
        <strong>{{ totalViews }}</strong>
      </div>

      <div class="stat-card">
        <span class="stat-label">Comments</span>
        <strong>{{ totalComments }}</strong>
      </div>

      <div class="stat-card">
        <span class="stat-label">Avg Views</span>
        <strong>{{ averageViews }}</strong>
      </div>
    </div>

    <ArticleViewsChart :articles="approvedArticles" />
  </div>
</template>

<style scoped>
.page {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1rem;
  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.header h1 {
  font-size: 2rem;
  margin: 0;
}

.header p {
  opacity: 0.6;
  margin: 0.2rem 0 0;
}

.create-btn {
  background: #3b82f6;
  border: none;
  color: white;
  padding: 0.7rem 1rem;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
}

.create-btn:hover {
  background: #2563eb;
}

.filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.filters button {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 999px;
  font-family: 'Merriweather', sans-serif;
  cursor: pointer;
  font-size: 0.85rem;
}

.filters button.active {
  background: #3b82f6;
  border-color: #3b82f6;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.card {
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 14px;
  padding: 1rem;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-3px);
  border-color: rgba(59, 130, 246, 0.4);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: start;
  gap: 0.5rem;
}

.card h3 {
  font-size: 1.1rem;
  margin: 0;
}

.excerpt {
  opacity: 0.7;
  font-size: 0.85rem;
  margin: 0.8rem 0;
}

.meta {
  font-size: 0.8rem;
  opacity: 0.6;
  margin-bottom: 0.8rem;
}

.actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: 'Merriweather', sans-serif;
}

.actions button {
  background: #3b82f6;
  border: none;
  color: white;
  padding: 0.4rem 0.7rem;
  border-radius: 8px;
  cursor: pointer;
}

.actions button:disabled {
  opacity: 0.5;
}

.hint {
  font-size: 0.75rem;
  opacity: 0.6;
}

.loading {
  opacity: 0.7;
}

.analytics-section {
  margin: 1rem;

  padding: 1.5rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.analytics-section h2 {
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));

  gap: 1rem;

  margin-bottom: 2rem;
}

.stat-card {
  padding: 1.25rem;

  border-radius: 14px;

  background: rgba(255, 255, 255, 0.04);

  border: 1px solid rgba(255, 255, 255, 0.08);

  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-label {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.6);
}

.stat-card strong {
  font-size: 1.8rem;
  color: white;
}
</style>
