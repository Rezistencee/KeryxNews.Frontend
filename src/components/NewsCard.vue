<script setup lang="ts">
defineProps<{
  title: string
  description: string
  imageUrl: string
  views?: number
  comments?: number
}>()
</script>

<template>
  <a href="#">
    <div class="card">
      <div class="image">
        <img :src="imageUrl" alt="News image" />
      </div>

      <div class="content">
        <h3 class="title">{{ title }}</h3>

        <p class="desc">{{ description }}</p>

        <div class="meta">
          <span v-if="views"
            ><svg
              width="24"
              height="24"
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
            {{ views }}</span
          >
          <span v-if="comments"
            ><svg
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
            {{ comments }}</span
          >
        </div>
      </div>
    </div>
  </a>
</template>

<style scoped>
a {
  display: block;
  text-decoration: none;
}

.card {
  display: flex;
  gap: 16px;
  background: #1b1f2a;
  border-radius: 12px;
  overflow: hidden;
  padding: 12px;
  color: white;
  width: 100%;
  box-sizing: border-box;
}

.image {
  width: 160px;
  height: 100px;
  flex-shrink: 0;
  border-radius: 10px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.title {
  font-size: 16pt;
  font-family: 'Merriweather', sans-serif;
  text-align: left;
  font-weight: 600;
  margin: 0;
}

.desc {
  font-size: 12pt;
  font-family: 'Merriweather', sans-serif;
  opacity: 0.8;
  margin: 6px 0;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-align: left;
}

.meta {
  display: flex;
  gap: 12px;
  font-size: 12px;
  opacity: 0.7;
}

.meta span {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

@media (max-width: 768px) {
  .card {
    flex-direction: column;
  }

  .image {
    width: 100%;
    height: 192px;
    background-size: cover;
    background-position: center;
  }

  .title {
    font-size: 18pt;
  }

  .desc {
    font-size: 12.5pt;
    margin: 12px 0;
  }

  .meta {
    font-size: 16px;
  }
}
</style>
