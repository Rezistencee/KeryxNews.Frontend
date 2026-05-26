<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/types/article'
import { getMyArticles, submitArticle } from '@/api/articles.service'
import AuthorArticleCard from '@/components/AuthorArticleCard.vue'
import { useDisclosure } from '@/composables/useDisclosure'
import CreateArticleModal from '@/components/modals/CreateArticleModal.vue'
import EditArticleModal from '@/components/modals/EditArticleModal.vue'

const router = useRouter()

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

.badge {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 999px;
  border: 1px solid;
  white-space: nowrap;
}

.badge.Draft {
  color: #cbd5e1;
  border-color: #cbd5e1;
  background: rgba(148, 163, 184, 0.1);
}

.badge.PendingReview {
  color: #fbbf24;
  border-color: #fbbf24;
  background: rgba(251, 191, 36, 0.1);
}

.badge.Approved {
  color: #22c55e;
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
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
</style>
