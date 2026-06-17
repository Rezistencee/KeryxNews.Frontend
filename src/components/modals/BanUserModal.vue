<script setup lang="ts">
import { ref, watch } from 'vue'
import type { User } from '@/types/user'

const props = defineProps<{
  user: User | null
  open: boolean
  loading?: boolean
}>()

const emit = defineEmits<{
  close: []
  submit: [{ reason: string; until: string | null }]
}>()

const reason = ref('')
const until = ref<string | null>(null)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) {
      reason.value = ''
      until.value = null
    }
  },
)

const close = () => emit('close')

const submit = () => {
  if (!reason.value.trim()) return

  emit('submit', {
    reason: reason.value,
    until: until.value,
  })
}
</script>

<template>
  <div v-if="open" class="overlay" @click.self="close">
    <div class="modal">
      <h2>Ban user</h2>

      <p v-if="user" class="user">{{ user.fullName }} ({{ user.email }})</p>

      <label>
        Reason
        <textarea v-model="reason" placeholder="Why are you banning this user?" rows="4" />
      </label>

      <label>
        Ban until (optional)
        <input type="datetime-local" v-model="until" />
      </label>

      <div class="hint">Leave empty for permanent ban</div>

      <div class="actions">
        <button @click="close" type="button">Cancel</button>

        <button :disabled="loading || !reason.trim()" @click="submit">
          {{ loading ? 'Banning...' : 'Ban user' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
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

.user {
  opacity: 0.7;
  font-size: 0.9rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  font-size: 0.85rem;
  opacity: 0.8;
}

textarea,
input {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 0.6rem;
  color: white;
  outline: none;
}

.hint {
  font-size: 0.75rem;
  opacity: 0.5;
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.6rem;
  margin-top: 1rem;
}

button {
  border: none;
  padding: 0.55rem 0.9rem;
  border-radius: 10px;
  cursor: pointer;
}

button:first-child {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

button:last-child {
  background: #ef4444;
  color: white;
}

button:disabled {
  opacity: 0.5;
}
</style>
