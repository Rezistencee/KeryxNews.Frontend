<script setup lang="ts">
import type { Article } from '@/types/article'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from 'chart.js'

import { Bar } from 'vue-chartjs'
import { computed } from 'vue'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

const props = defineProps<{
  articles: Article[]
}>()

const chartData = computed(() => ({
  labels: props.articles.map((a) => (a.title.length > 25 ? a.title.slice(0, 25) + '...' : a.title)),
  datasets: [
    {
      label: 'Views',
      data: props.articles.map((a) => a.views),
      backgroundColor: '#ff4d6d',
      borderRadius: 6,
    },
    {
      label: 'Comments',
      data: props.articles.map((a) => a.commentsCount),
      backgroundColor: '#3b82f6',
      borderRadius: 6,
    },
  ],
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  indexAxis: 'y',
}
</script>

<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<style scoped>
.chart-wrapper {
  height: 400px;
}
</style>
