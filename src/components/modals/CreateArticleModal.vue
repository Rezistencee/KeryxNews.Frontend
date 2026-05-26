<script setup lang="ts">
import { ref } from 'vue'
import { createArticle } from '@/api/articles.service'

const emit = defineEmits<{
  close: []
  created: []
}>()

const title = ref('')
const content = ref('')
const imageUrl = ref('')

const loading = ref(false)

const submit = async () => {
  loading.value = true
  try {
    await createArticle({
      title: title.value,
      content: content.value,
      imageUrl: imageUrl.value || null,
    })

    emit('created')
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
      <h2>Create Draft Article</h2>

      <input v-model="title" placeholder="Title" />

      <input v-model="imageUrl" placeholder="Image URL (optional)" />

      <textarea v-model="content" placeholder="Content" rows="6" />

      <div class="actions">
        <button @click="close" type="button">Cancel</button>

        <button :disabled="loading || !title || !content" @click="submit">
          {{ loading ? 'Creating...' : 'Save Draft' }}
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

  animation: fadeIn 0.15s ease-out;
}

.modal {
  width: min(520px, 92vw);
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  color: white;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

h2 {
  margin: 0 0 1rem;
  font-size: 1.3rem;
}

input,
textarea {
  width: 100%;
  box-sizing: border-box;
  display: block;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;

  padding: 0.7rem 0.8rem;
  color: white;

  margin-bottom: 0;
  outline: none;

  font-family: inherit;
  transition: 0.2s;
}

input:focus,
textarea:focus {
  border-color: #3b82f6;
  background: rgba(255, 255, 255, 0.08);
}

textarea {
  resize: none;
  min-height: 140px;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

.actions button {
  border: none;
  border-radius: 10px;
  padding: 0.6rem 0.9rem;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.actions button:first-child {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.actions button:first-child:hover {
  background: rgba(255, 255, 255, 0.12);
}

.actions button:last-child {
  background: #3b82f6;
  color: white;
}

.actions button:last-child:hover {
  background: #2563eb;
}

.actions button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
