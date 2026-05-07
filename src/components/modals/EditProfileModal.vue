<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  username: string
  avatarUrl: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (
    e: 'save',
    payload: {
      username: string
      avatarUrl: string
    },
  ): void
}>()

const username = ref(props.username)
const avatarUrl = ref(props.avatarUrl)

const onSave = () => {
  emit('save', {
    username: username.value,
    avatarUrl: avatarUrl.value,
  })

  emit('close')
}
</script>

<template>
  <div class="modal-overlay" @click.self="emit('close')">
    <div class="modal">
      <h2>Edit profile</h2>

      <div class="form-group">
        <label>Username</label>

        <input v-model="username" type="text" placeholder="Enter username" />
      </div>

      <div class="form-group">
        <label>Avatar URL</label>

        <input v-model="avatarUrl" type="text" placeholder="Enter avatar URL" />
      </div>

      <div class="actions">
        <button class="cancel" @click="emit('close')">Cancel</button>

        <button class="save" @click="onSave">Save</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.7);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
}

.modal {
  width: 100%;
  max-width: 420px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border-radius: 18px;
  padding: 1.5rem;

  color: white;

  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
}

.modal h2 {
  margin-bottom: 1.2rem;

  font-size: 1.5rem;
  font-family: 'Merriweather', sans-serif;
}

.form-group {
  display: flex;
  flex-direction: column;

  gap: 0.45rem;
  margin-bottom: 1rem;
}

.form-group label {
  color: rgba(255, 255, 255, 0.75);
  font-size: 0.9rem;
}

.form-group input {
  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.1);

  border-radius: 10px;

  padding: 0.8rem 1rem;

  color: white;
  font-size: 0.95rem;

  outline: none;
}

.form-group input:focus {
  border-color: rgba(59, 130, 246, 0.8);
}

.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;

  margin-top: 1.5rem;
}

.actions button {
  border: none;
  border-radius: 10px;

  padding: 0.7rem 1.2rem;

  cursor: pointer;
  transition: 0.2s;
}

.cancel {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.cancel:hover {
  background: rgba(255, 255, 255, 0.14);
}

.save {
  background: rgba(59, 130, 246, 0.85);
  color: white;
}

.save:hover {
  background: rgba(59, 130, 246, 1);
}
</style>
