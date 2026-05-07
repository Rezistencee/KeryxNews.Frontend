<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { formatDate } from '@/utils/formatDate'

import type { User } from '@/types/user'
import type { Article } from '@/types/article'
import { useModal } from '@/composables/useModal'
import EditProfileModal from '@/components/modals/EditProfileModal.vue'

const user = ref<User>({
  username: 'Rezistence',
  avatarUrl: 'https://i.pinimg.com/736x/46/ab/15/46ab15d5d0cefcf79826163694b03204.jpg',
  createdAt: '2026-05-02',
})

const roles = ref([
  { name: 'Admin', type: 'admin' },
  { name: 'Author', type: 'author' },
  { name: 'User', type: 'user' },
])

const editModal = useModal()

const activeTab = ref<'posts' | 'comments'>('posts')
const isOwnProfile = ref(true)

const isAuthor = ref(false)
const isBanned = ref(true)

const posts = ref<Article[]>([
  {
    id: 1,
    title: 'Naughty Dog & TLOU 3',
    content: 'In the AAA gaming space...',
    createdAt: '2026-05-06',
  },
])

const comments = ref([
  {
    id: 2,
    content: 'Naughty Dog still cooking.',
    createdAt: '2026-05-08',
  },
  {
    id: 1,
    content: 'This update actually looks promising.',
    createdAt: '2026-05-07',
  },
])

const loadingPosts = ref(false)

onMounted(async () => {
  isAuthor.value = roles.value.some((role) => role.name === 'Author')
})

const onSaveProfile = (payload: { username: string; avatarUrl: string }) => {
  user.value.username = payload.username
  user.value.avatarUrl = payload.avatarUrl
}
</script>

<template>
  <div class="profile-page">
    <div class="profile-header">
      <img :src="user.avatarUrl" alt="User avatar" class="avatar" />

      <div class="info">
        <div class="username-row">
          <h2 class="username">{{ user.username }}</h2>

          <span v-if="!isOwnProfile" class="report-chip-text"> Report </span>
        </div>
        <p class="registered">Member since: {{ formatDate(user.createdAt) }}</p>

        <div class="chips">
          <span v-for="role in roles" :key="role.name" class="chip" :class="role.type">
            {{ role.name }}
          </span>
        </div>
      </div>

      <div class="actions" v-if="isOwnProfile">
        <button @click="editModal.open">Edit</button>
        <button v-if="isAuthor">My Articles</button>
        <button>Settings</button>
      </div>
    </div>

    <div class="warning-banner" v-if="isBanned">
      This user is currently suspended for violating community guidelines.
    </div>

    <div class="profile-tabs">
      <button :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Posts</button>

      <button :class="{ active: activeTab === 'comments' }" @click="activeTab = 'comments'">
        Comments
      </button>
    </div>

    <div class="user-activity">
      <div v-if="activeTab === 'posts'">
        <h3>Last articles</h3>
        <div v-if="loadingPosts">Loading posts...</div>

        <div v-else-if="posts.length === 0">No posts yet</div>

        <div v-else class="posts">
          <div v-for="post in posts" :key="post.id" class="post-card">
            <h4>{{ post.title }}</h4>

            <p>{{ post.content }}</p>

            <span>{{ formatDate(post.createdAt) }}</span>
          </div>
        </div>
      </div>

      <div v-else-if="activeTab === 'comments'">
        <h3>Last comments</h3>
        <div v-if="comments.length === 0">No comments yet</div>

        <div v-else class="posts">
          <div v-for="comment in comments" :key="comment.id" class="post-card">
            <p>{{ comment.content }}</p>

            <span>{{ formatDate(comment.createdAt) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <EditProfileModal
    v-if="editModal.isOpen.value"
    :username="user.username"
    :avatar-url="user.avatarUrl"
    @close="editModal.close"
    @save="onSaveProfile"
  />
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 2rem;
  background: #0b0f17;
}

.profile-header {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.5rem;

  width: 100%;
  max-width: 960px;

  background: linear-gradient(135deg, #1e293b, #0f172a);
  box-sizing: border-box;
  border-radius: 16px;
  padding: 1.25rem;
  color: white;

  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.6);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.actions button {
  padding: 0.6rem 2rem;
  border: none;
  border-radius: 10px;

  background: rgba(255, 255, 255, 0.08);
  color: white;

  font-family: 'Merriweather', sans-serif;
  font-size: 1rem;

  cursor: pointer;
  transition: 0.2s;
}

.actions button:hover {
  background: rgba(255, 255, 255, 0.14);
}

.avatar {
  width: 128px;
  height: 128px;
  border-radius: 50%;
  object-fit: cover;

  border: 2px solid rgba(255, 255, 255, 0.1);
}

.username-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.username {
  font-family: 'Merriweather', sans-serif;
  font-size: 1.6rem;
  font-weight: bold;
}

.registered {
  margin-top: 0.2rem;
  color: rgba(255, 255, 255, 0.6);
}

.warning-banner {
  box-sizing: border-box;

  width: 100%;
  max-width: 960px;

  margin-top: 1rem;
  padding: 1rem 1.2rem;

  border-radius: 14px;

  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);

  color: rgb(252, 165, 165);

  font-family: 'Merriweather', sans-serif;
  font-size: 0.95rem;
  line-height: 1.5;

  backdrop-filter: blur(8px);
}

.profile-tabs {
  width: 100%;
  max-width: 960px;
  margin-top: 1.5rem;

  display: flex;
  gap: 1rem;

  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.25rem;
}

.profile-tabs button {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);

  font-family: 'Merriweather', sans-serif;
  font-size: 1rem;

  cursor: pointer;
  padding: 0.5rem 0.75rem;

  border-bottom: 2px solid transparent;
  transition: 0.2s;
}

.profile-tabs button.active {
  color: white;
  border-bottom: 2px solid rgba(59, 130, 246, 0.8);
}

.user-activity {
  box-sizing: border-box;
  width: 100%;
  max-width: 960px;

  margin-top: 1rem;

  background: linear-gradient(135deg, #1e293b, #0f172a);
  border-bottom-left-radius: 16px;
  border-bottom-right-radius: 16px;
  padding: 1.25rem;
  color: white;

  font-family: 'Merriweather', sans-serif;
}

.user-activity h3 {
  font-size: 1.6rem;
  font-weight: bold;
}

.posts {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 1rem;
}

.post-card {
  padding: 1rem 1.2rem;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);

  transition: 0.2s ease;

  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.post-card p {
  margin: 0;
  color: rgba(255, 255, 255, 0.75);
  line-height: 1.5;
}

.post-card:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateY(-2px);
}

.post-card span {
  font-size: 0.8rem;
  color: rgba(255, 255, 255, 0.5);
}

.chips {
  margin-top: 0.7rem;
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.chip {
  background: rgba(255, 255, 255, 0.08);
  padding: 4px 10px;
  border-radius: 100px;
  font-family: 'Merriweather', sans-serif;
  font-size: 0.8rem;
  transition: 0.2s;
}

.chip.admin {
  background: rgba(226, 13, 95, 0.25);
  border: 1px solid rgba(224, 16, 96, 0.4);
}

.chip.author {
  background: rgba(59, 130, 246, 0.25);
  border: 1px solid rgba(59, 130, 246, 0.4);
}

.chip.user {
  background: rgba(34, 197, 94, 0.25);
  border: 1px solid rgba(34, 197, 94, 0.4);
}

.report-chip-text {
  display: inline-flex;
  align-items: center;

  font-size: 0.7rem;
  font-weight: 600;

  padding: 4px 10px;
  border-radius: 999px;

  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);

  color: rgba(255, 255, 255, 0.75);

  cursor: pointer;
  transition: 0.25s;
}

.report-chip-text:hover {
  background: rgba(239, 68, 68, 0.18);
  border-color: rgba(239, 68, 68, 0.4);
  color: rgba(239, 68, 68, 1);
}

@media (max-width: 768px) {
  .profile-page {
    padding: 20px;
  }

  .profile-header {
    grid-template-columns: 1fr;
    text-align: center;

    max-width: 768px;

    gap: 1rem;
  }

  .avatar {
    margin: 0 auto;
  }

  .username-row {
    justify-content: center;
  }

  .username {
    font-size: 2rem;
  }

  .registered {
    font-size: 1.2rem;
  }

  .profile-tabs {
    max-width: 768px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .user-activity {
    max-width: 768px;
  }

  .chips {
    justify-content: center;
  }

  .chip {
    font-size: 1rem;
  }
}
</style>
