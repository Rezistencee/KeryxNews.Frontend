import { computed, ref } from 'vue'

export const usePagination = (initialPage = 1, pageSize = 10) => {
  const page = ref(initialPage)
  const total = ref(0)

  const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

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

  const setTotal = (value: number) => {
    total.value = value
  }

  return {
    page,
    pageSize,
    total,
    totalPages,
    nextPage,
    prevPage,
    setTotal,
  }
}
