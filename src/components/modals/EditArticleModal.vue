<script setup lang="ts">
import { ref } from 'vue'
import type { Article } from '@/types/article'
import { updateArticle } from '@/api/articles.service'

const props = defineProps<{
  article: Article
}>()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const title = ref(props.article.title)
const content = ref(props.article.content)
const imageUrl = ref(props.article.imageUrl || '')

const loading = ref(false)

const submit = async () => {
  loading.value = true

  try {
    await updateArticle(String(props.article.id), {
      title: title.value,
      content: content.value,
      imageUrl: imageUrl.value || null,
    })

    emit('updated')
    emit('close')
  } finally {
    loading.value = false
  }
}

const close = () => emit('close')
</script>

<template>
  <div class="overlay" @click.self="close">
    <div class="modal">
      <h2>Edit Draft</h2>

      <input v-model="title" placeholder="Title" />

      <input v-model="imageUrl" placeholder="Image URL" />

      <textarea v-model="content" rows="8" placeholder="Content" />

      <div class="actions">
        <button @click="close">Cancel</button>

        <button :disabled="loading || !title || !content" @click="submit">
          {{ loading ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;
}

.modal {
  width: min(520px, 92vw);

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 16px;

  padding: 1.5rem;

  color: white;

  display: flex;
  flex-direction: column;

  gap: 0.8rem;
}

input,
textarea {
  width: 100%;

  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 10px;

  padding: 0.8rem;

  color: white;

  box-sizing: border-box;
}

textarea {
  resize: vertical;
  min-height: 180px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
}

button {
  border: none;
  border-radius: 10px;
  padding: 0.7rem 1rem;
  cursor: pointer;
}

.actions button:first-child {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.actions button:last-child {
  background: #3b82f6;
  color: white;
}
</style>
