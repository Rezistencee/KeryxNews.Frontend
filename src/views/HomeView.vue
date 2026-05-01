<script setup lang="ts">
import { ref } from 'vue'
import NewsCard from '@/components/NewsCard.vue'

const slides = [
  {
    id: 1,
    text: 'Assassin`s Creed Resynced',
    imageUrl:
      'https://c1-ebgames.eb-cdn.com.au/merchandising/images/screenshots/1ba4968cfe924da0bac2a794c7618d26_l.jpg',
  },
  {
    id: 2,
    text: 'Windrose release',
    imageUrl:
      'https://cdn1.epicgames.com/spt-assets/37958149814246918b62a0da04d31e21/windrose-1fmu9.png?resize=1&w=480&h=270&quality=medium',
  },
  {
    id: 3,
    text: "Arc Raiders 'Riven Tides' update",
    imageUrl: 'https://frvr.com/wp-content/uploads/2026/04/arc-raiders-riven-tides-patch.jpg',
  },
]

const current = ref(0)

const nextSlide = () => {
  current.value = (current.value + 1) % slides.length
}

const prevSlide = () => {
  current.value = (current.value - 1 + slides.length) % slides.length
}
</script>

<template>
  <div class="container">
    <section>
      <div class="section-top">
        <div class="section-header">
          <h2>Trending</h2>
        </div>

        <div class="banner-counter">
          <p>{{ current + 1 }} / {{ slides.length }}</p>
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
              backgroundImage: `url(${slides[current]?.imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }"
          >
            <h1>{{ slides[current]?.text }}</h1>
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
          title="Naughty Dog & TLOU 3"
          description="In the AAA gaming space, Naughty Dog has been at the forefront of technological innovation for many years..."
          imageUrl="https://www.denofgeek.com/wp-content/uploads/2020/06/the-last-of-us-part-2-ellie-joel.jpg?resize=768%2C432"
          :views="1850"
          :comments="86"
        />

        <NewsCard
          title="Naughty Dog & TLOU 3"
          description="In the AAA gaming space, Naughty Dog has been at the forefront of technological innovation for many years..."
          imageUrl="https://www.denofgeek.com/wp-content/uploads/2020/06/the-last-of-us-part-2-ellie-joel.jpg?resize=768%2C432"
          :views="2300"
          :comments="156"
        />

        <NewsCard
          title="Naughty Dog & TLOU 3"
          description="In the AAA gaming space, Naughty Dog has been at the forefront of technological innovation for many years..."
          imageUrl="https://www.denofgeek.com/wp-content/uploads/2020/06/the-last-of-us-part-2-ellie-joel.jpg?resize=768%2C432"
          :views="4568"
          :comments="280"
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
}

.slide h1 {
  font-family: 'Merriweather', sans-serif;
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

  .content__container {
    max-width: 768px;
  }
}
</style>
