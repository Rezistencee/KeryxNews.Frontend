<script setup lang="ts">
import { onMounted, ref } from 'vue'
import NewsCard from '@/components/NewsCard.vue'
import type { Article } from '@/types/article'
import { getLatest, getTrending } from '@/api/articles.service'
import { useRouter } from 'vue-router'

const router = useRouter()

const articles = ref<Article[]>([])
const trending = ref<Article[]>([])

const current = ref(0)

const nextSlide = () => {
  current.value = (current.value + 1) % trending.value.length
}

const prevSlide = () => {
  current.value = (current.value - 1 + trending.value.length) % trending.value.length
}

const openArticle = (id: string) => {
  router.push(`/articles/${id}`)
}

onMounted(async () => {
  try {
    const [latest, trendingArticles] = await Promise.all([getLatest(1, 10), getTrending(3)])

    articles.value = latest
    trending.value = trendingArticles
  } catch (error) {
    console.error(error)
  }
})
</script>

<template>
  <div class="container">
    <section>
      <div class="section-top">
        <div class="section-header">
          <h2>Trending</h2>
        </div>

        <div class="banner-counter">
          <p>{{ current + 1 }} / {{ trending.length }}</p>
        </div>
      </div>

      <div class="banner-wrapper">
        <button class="arrow" @click="prevSlide">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        <div class="banner">
          <div
            class="slide"
            :style="{
              backgroundImage: `url(${trending[current]?.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
            @click="openArticle(String(trending[current]?.id))"
          >
            <h1>{{ trending[current]?.title }}</h1>
          </div>
        </div>

        <button class="arrow" @click="nextSlide">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>

    <section class="content">
      <h1>Latest news</h1>

      <div class="content__container">
        <NewsCard
          v-for="article in articles"
          :key="article.id"
          :title="article.title"
          :description="article.content"
          :imageUrl="article.imageUrl"
          :views="article.views"
          :comments="3"
          @click="openArticle(String(article.id))"
        />
      </div>
    </section>
  </div>
</template>

<style scoped>
.container {
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  gap: 2rem;
}

.section-top {
  max-width: 960px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  box-sizing: border-box;
}

.banner-counter {
  width: 50px;
  color: white;
  font-size: 12pt;
  opacity: 0.7;
  font-family: 'Merriweather', sans-serif;
  text-align: right;
}

.section-header {
  width: auto;
}

.section-header h2 {
  color: white;
  font-size: 21pt;
  font-weight: bold;
  text-align: left;
  font-family: 'Bebas Neue', sans-serif;
  margin-bottom: 0.5rem;
}

.banner-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.banner {
  width: 960px;
  max-width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 12px;
}

.slide {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.slide {
  transition: transform 0.2s ease;
}

.slide:hover {
  transform: scale(1.01);
}

.slide h1 {
  font-family: 'Merriweather', sans-serif;
  font-size: 2rem;
}

.arrow {
  background: #2c3e50;
  border: none;
  color: white;
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: 0.2s;
}

.arrow:hover {
  background: #34495e;
}

.content {
  width: 960px;
  max-width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

.content h1 {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 21pt;
  text-align: left;
  color: white;
}

.content__container {
  max-width: 960px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .section-header {
    padding-left: 2rem;
  }

  .banner-counter {
    padding-right: 60px;
    width: 70px;
  }

  .content {
    padding: 0 1rem;
  }

  .content h1 {
    padding-left: 1rem;
  }

  .slide h1 {
    font-size: 1.2rem;
  }

  .content__container {
    max-width: 768px;
  }
}
</style>
