<script setup lang="ts">
import { reportUser } from '@/api/users'
import { ref } from 'vue'

const props = defineProps<{
  userId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const reason = ref('')
const loading = ref(false)
const error = ref('')
const success = ref(false)

async function submitReport() {
  try {
    error.value = ''

    if (!reason.value.trim()) {
      error.value = 'Please provide a reason'
      return
    }

    loading.value = true

    await reportUser(props.userId, reason.value)

    success.value = true

    setTimeout(() => {
      emit('close')
    }, 1200)
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'Failed to send report'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Report user</h2>

      <p class="description">Explain why you are reporting this user.</p>

      <textarea v-model="reason" placeholder="Write report reason..." />

      <p v-if="error" class="error">
        {{ error }}
      </p>

      <p v-if="success" class="success">Report submitted successfully</p>

      <div class="actions">
        <button class="cancel" @click="emit('close')">Cancel</button>

        <button class="submit" @click="submitReport" :disabled="loading">
          {{ loading ? 'Sending...' : 'Submit' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.6);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 999;
}

.modal {
  width: 100%;
  max-width: 500px;

  background: #111827;

  border: 1px solid rgba(255, 255, 255, 0.08);

  border-radius: 16px;

  padding: 1.5rem;

  color: white;
}

h2 {
  margin: 0;
  font-size: 1.4rem;
}

.description {
  margin-top: 0.5rem;
  color: rgba(255, 255, 255, 0.7);
}

textarea {
  width: 100%;
  min-height: 140px;

  margin-top: 1rem;

  resize: vertical;

  border: none;
  outline: none;

  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);

  color: white;

  padding: 1rem;

  box-sizing: border-box;

  font-family: inherit;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;

  margin-top: 1rem;
}

button {
  border: none;
  cursor: pointer;

  padding: 0.7rem 1.2rem;
  border-radius: 10px;

  transition: 0.2s;
}

.cancel {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.submit {
  background: rgb(239, 68, 68);
  color: white;
}

.submit:hover {
  background: rgb(220, 38, 38);
}

.error {
  color: rgb(248, 113, 113);
  margin-top: 0.75rem;
}

.success {
  color: rgb(74, 222, 128);
  margin-top: 0.75rem;
}
</style>
