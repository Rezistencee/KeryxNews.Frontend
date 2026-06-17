<script setup lang="ts">
import { getPendingArticles, publishArticle, rejectArticle } from '@/api/articles.service'
import { getReports } from '@/api/reports.service'
import { banUser, deleteUser, getUsers, unbanUser, updateUserRoles } from '@/api/users'
import { usePagination } from '@/composables/usePagination'
import { useAuthStore } from '@/stores/auth'
import type { Article } from '@/types/article'
import type { PageResponse } from '@/types/pageResponse'
import type { User } from '@/types/user'
import type { Report } from '@/types/report'
import { formatDate } from '@/utils/formatDate'
import { onMounted, ref, watch } from 'vue'
import { watchDebounced } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useDisclosure } from '@/composables/useDisclosure'
import BanUserModal from '@/components/modals/BanUserModal.vue'

const router = useRouter()

const auth = useAuthStore()

type Section = 'articles' | 'users' | 'reports'

const users = ref<User[]>([])
const reports = ref<Report[]>([])

const pendingArticles = ref<Article[]>([])

const previewArticle = ref<Article | null>(null)

const currentSection = ref<Section>('articles')

const allRoles: string[] = ['User', 'Author', 'Admin']

const userSearch = ref('')
const { page, pageSize, totalPages, setTotal, nextPage, prevPage } = usePagination(1, 6)

const selectedUser = ref<User | null>(null)
const banModal = useDisclosure()
const banning = ref(false)

const loading = ref(false)

const openBanModal = (user: User) => {
  selectedUser.value = user
  banModal.open()
}

const loadUsers = async () => {
  try {
    loading.value = true

    const response: PageResponse<User> = await getUsers(page.value, pageSize, userSearch.value)

    users.value = response.items
    setTotal(response.meta.total)
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const isBanned = (user: User) => {
  if (!user.banUntil) return false
  return new Date(user.banUntil) > new Date()
}

const submitBan = async (payload: { reason: string; until: string | null }) => {
  if (!selectedUser.value) return

  try {
    banning.value = true

    const untilDate = payload.until ? new Date(payload.until).toISOString() : null

    await banUser(String(selectedUser.value.id), {
      reason: payload.reason,
      until: untilDate,
    })

    banModal.close()
    selectedUser.value = null

    await loadUsers()
  } catch (e) {
    console.error(e)
  } finally {
    banning.value = false
  }
}
const toggleBan = async (user: User) => {
  if (isBanned(user)) {
    await unbanUser(String(user.id))
    await loadUsers()
    return
  }

  openBanModal(user)
}

const loadPending = async () => {
  try {
    loading.value = true

    const response = await getPendingArticles()

    pendingArticles.value = response
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadReports = async () => {
  try {
    reports.value = await getReports()
  } catch (e) {
    console.error(e)
  }
}

const approveArticle = async (id: string) => {
  try {
    await publishArticle(id)

    pendingArticles.value = pendingArticles.value.filter((a) => a.id !== id)

    previewArticle.value = null
  } catch (e) {
    console.error(e)
  }
}

const onReject = async (id: string) => {
  try {
    await rejectArticle(id)

    pendingArticles.value = pendingArticles.value.filter((article) => article.id !== id)
  } catch (error) {
    console.error(error)
  }
}

const toggleRole = async (user: User, role: string) => {
  if (!user.roles) user.roles = []

  const hasRole = user.roles.includes(role)

  const newRoles = hasRole ? user.roles.filter((r) => r !== role) : [...user.roles, role]

  try {
    await updateUserRoles(String(user.id), newRoles)

    user.roles = newRoles
  } catch (e) {
    console.error(e)
  }
}

const onDeleteUser = async (user: User) => {
  const confirmed = window.confirm(
    `Delete user "${user.fullName}"?\n\nThis action cannot be undone.`,
  )

  if (!confirmed) return

  try {
    await deleteUser(String(user.id))

    users.value = users.value.filter((u) => u.id !== user.id)
  } catch (error) {
    console.error(error)
  }
}

const viewTarget = (report: Report) => {
  if (report.targetType === 'User') {
    router.push(`/profile/${report.targetId}`)
    return
  }

  console.log('Unsupported target type:', report.targetType)
}

watch(page, () => loadUsers())

watchDebounced(
  userSearch,
  () => {
    page.value = 1
    loadUsers()
  },
  {
    debounce: 750,
    maxWait: 1000,
  },
)

onMounted(async () => {
  await Promise.all([loadUsers(), loadPending(), loadReports()])
})
</script>

<template>
  <div class="admin-page">
    <div class="layout">
      <aside class="sidebar">
        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'articles' }"
          @click="currentSection = 'articles'"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M7 4H17M7 8H17M7 12H13"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />

            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>

          Pending Articles
        </button>

        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'users' }"
          @click="currentSection = 'users'"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />

            <path
              d="M5 20C5 16.7 8.1 14 12 14C15.9 14 19 16.7 19 20"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>

          Users
        </button>

        <button
          class="sidebar-btn"
          :class="{ active: currentSection === 'reports' }"
          @click="currentSection = 'reports'"
        >
          <svg class="icon" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 9v4m0 4h.01"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <path
              d="M10.29 3.86l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.71-3.14l-8-14a2 2 0 0 0-3.42 0z"
              stroke="currentColor"
              stroke-width="2"
            />
          </svg>

          Reports
        </button>
      </aside>

      <main class="content">
        <div class="admin-header">
          <div>
            <h1>Admin Panel</h1>
            <p>Hello, {{ auth.user?.fullName }}</p>
          </div>
        </div>

        <div v-if="currentSection === 'articles'" class="card">
          <div class="header">
            <h2>Pending Review</h2>

            <span>{{ pendingArticles.length }} articles</span>
          </div>

          <table class="articles-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="article in pendingArticles" :key="article.id">
                <td class="title-cell">
                  {{ article.title }}
                </td>

                <td>{{ article.author.name }}</td>

                <td>{{ formatDate(article.createdAt) }}</td>

                <td>
                  <div class="actions">
                    <button class="preview-btn" @click="previewArticle = article">Preview</button>

                    <button class="approve-btn" @click="approveArticle(String(article.id))">
                      Approve
                    </button>

                    <button class="reject-btn" @click="onReject(String(article.id))">Reject</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="currentSection === 'users'" class="users-panel">
          <div class="users-toolbar">
            <input
              v-model="userSearch"
              type="text"
              placeholder="Search users by name or email..."
              class="search-input"
            />
          </div>

          <div class="users-grid">
            <div v-for="user in users" :key="user.id" class="user-card">
              <div class="top">
                <img :src="user.avatarUrl" />

                <div class="info">
                  <h3>{{ user.fullName }}</h3>

                  <p>{{ user.email }}</p>
                </div>
              </div>

              <div class="role-section">
                <label>Roles</label>

                <div class="roles">
                  <button
                    v-for="role in allRoles"
                    :key="role"
                    class="role-chip"
                    :class="{ active: user.roles?.includes(role) }"
                    @click="toggleRole(user, role)"
                  >
                    {{ role }}
                  </button>
                </div>
              </div>

              <div class="bottom">
                <span class="status" :class="{ banned: isBanned(user) }">
                  {{ isBanned(user) ? 'Banned' : 'Active' }}
                </span>

                <div class="user-actions">
                  <button
                    class="ban-btn"
                    :class="{ unban: isBanned(user) }"
                    @click="toggleBan(user)"
                  >
                    {{ isBanned(user) ? 'Unban' : 'Ban' }}
                  </button>

                  <button class="delete-btn" @click="onDeleteUser(user)">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="currentSection === 'reports'" class="reports-grid">
          <div v-for="report in reports" :key="report.id" class="report-card">
            <div class="report-header">
              <div class="report-top">
                <div class="report-left">
                  <span class="report-type" :class="report.targetType.toLowerCase()">
                    {{ report.targetType }}
                  </span>
                </div>

                <div class="report-right">
                  <span class="report-date">
                    {{ formatDate(report.createdAt) }}
                  </span>
                </div>
              </div>

              <div class="right">
                <span class="report-id">#{{ report.id.slice(0, 6) }}</span>
              </div>
            </div>

            <div class="report-target">
              <h3>{{ report.targetName }}</h3>
              <p>Target ID: {{ report.targetId }}</p>
            </div>

            <div class="report-meta">
              <div class="reporter">
                <span class="label">Reporter</span>
                <span class="value">{{ report.reporterName }}</span>
              </div>

              <div class="reason">
                <span class="label">Reason</span>
                <span class="value">{{ report.reason }}</span>
              </div>
            </div>

            <div class="report-actions">
              <button class="view-btn" @click="viewTarget(report)">View target</button>

              <button class="action-btn danger">Ban / Remove</button>

              <button class="action-btn ghost">Dismiss</button>
            </div>
          </div>
        </div>

        <div class="pagination" v-if="currentSection === 'users'">
          <button :disabled="page === 1" @click="prevPage">Previous</button>

          <span> Page {{ page }} / {{ totalPages }} </span>

          <button :disabled="page === totalPages" @click="nextPage">Next</button>
        </div>
      </main>
    </div>

    <div v-if="previewArticle" class="preview-overlay" @click.self="previewArticle = null">
      <div class="preview-modal">
        <img v-if="previewArticle.imageUrl" :src="previewArticle.imageUrl" class="preview-image" />

        <h1>{{ previewArticle.title }}</h1>

        <div class="preview-meta">By {{ previewArticle.author.name }}</div>

        <div class="preview-content" v-html="previewArticle.content"></div>

        <div class="preview-actions">
          <button class="reject-btn" @click="onReject(String(previewArticle.id))">Reject</button>

          <button class="approve-btn" @click="approveArticle(String(previewArticle.id))">
            Approve
          </button>
        </div>
      </div>
    </div>
  </div>

  <BanUserModal
    :open="banModal.isOpen.value"
    :user="selectedUser"
    :loading="banning"
    @close="banModal.close()"
    @submit="submitBan"
  />
</template>

<style scoped>
.admin-page {
  min-height: 100vh;
  padding: 2rem 1rem;
  background: #0b0f17;
}

.layout {
  max-width: 1400px;
  margin: 0 auto;

  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.5rem;
}

.sidebar {
  height: fit-content;

  position: sticky;
  top: 1rem;

  display: flex;
  flex-direction: column;
  gap: 0.7rem;

  padding: 1rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);
}

.sidebar-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;

  width: 100%;

  border: none;

  background: transparent;

  color: rgba(255, 255, 255, 0.7);

  padding: 0.95rem 1rem;

  border-radius: 12px;

  cursor: pointer;

  transition: 0.2s;
}

.sidebar-btn:hover {
  background: rgba(255, 255, 255, 0.05);
  color: white;
}

.sidebar-btn.active {
  background: rgba(59, 130, 246, 0.18);
  border: 1px solid rgba(59, 130, 246, 0.35);

  color: white;

  box-shadow: 0 0 25px rgba(59, 130, 246, 0.15);
}

.icon {
  width: 20px;
  height: 20px;
}

.content {
  min-width: 0;
}

.admin-header {
  margin-bottom: 1.5rem;
  padding: 1.2rem 1.5rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.admin-header h1 {
  margin: 0;
  font-size: 1.4rem;
}

.admin-header p {
  margin: 0.3rem 0 0;
  opacity: 0.7;
}

.card {
  padding: 1.5rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
}

.articles-table {
  width: 100%;
  border-collapse: collapse;
}

th {
  text-align: left;
  opacity: 0.6;
  padding-bottom: 1rem;
}

td {
  padding: 1rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  white-space: normal;
  word-break: break-word;
}

.title-cell {
  width: 45%;

  white-space: normal;
  word-break: break-word;
}

.actions {
  display: flex;
  gap: 0.6rem;
}

.preview-btn,
.approve-btn,
.reject-btn {
  border: none;

  padding: 0.5rem 0.9rem;

  border-radius: 8px;

  color: white;

  cursor: pointer;

  transition: 0.2s;
}

.preview-btn {
  background: rgba(255, 255, 255, 0.08);
}

.preview-btn:hover {
  background: rgba(255, 255, 255, 0.12);
}

.approve-btn {
  background: #22c55e;
}

.approve-btn:hover {
  background: #16a34a;
}

.reject-btn {
  background: #ef4444;
}

.reject-btn:hover {
  background: #dc2626;
}

.users-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1rem;
}

.users-toolbar {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-actions {
  display: flex;
  gap: 8px;
  align-items: center;
}

.ban-btn,
.delete-btn {
  padding: 0.55rem 0.9rem;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
  transition: 0.2s;
  white-space: nowrap;
}

.delete-btn {
  padding: 8px;
  background: rgba(239, 68, 68, 0.85);
}

.delete-btn:hover {
  background: #dc2626;
}

.search-input {
  flex: 1;
  background: #1f2937;
  border: 1px solid #374151;
  color: white;
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.search-input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.user-card {
  padding: 1.2rem;

  border-radius: 18px;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border: 1px solid rgba(255, 255, 255, 0.08);

  color: white;
}

.pagination {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
}

.pagination button {
  background: #2c3e50;
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.pagination button:hover:not(:disabled) {
  background: #34495e;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.top {
  display: flex;
  gap: 1rem;
  align-items: center;

  margin-bottom: 1rem;
}

.top img {
  width: 64px;
  height: 64px;

  border-radius: 50%;

  object-fit: cover;
}

.info h3 {
  margin: 0;
}

.info p {
  margin: 0.3rem 0 0;
  opacity: 0.65;
  font-size: 0.9rem;
}

.role-section {
  margin-bottom: 1rem;
}

.role-section label {
  display: block;
  margin-bottom: 0.7rem;

  opacity: 0.7;
}

.roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-chip {
  border: 1px solid rgba(255, 255, 255, 0.1);

  background: rgba(255, 255, 255, 0.05);

  color: rgba(255, 255, 255, 0.75);

  padding: 0.45rem 0.75rem;

  border-radius: 999px;

  cursor: pointer;

  transition: 0.2s;
}

.role-chip:hover {
  background: rgba(255, 255, 255, 0.08);
}

.role-chip.active {
  background: rgba(59, 130, 246, 0.18);

  border-color: rgba(59, 130, 246, 0.4);

  color: white;

  box-shadow: 0 0 18px rgba(59, 130, 246, 0.18);
}

.bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 1rem;
}

.status {
  color: #22c55e;
}

.status.banned {
  color: #ef4444;
}

.ban-btn {
  border: none;

  padding: 0.55rem 0.9rem;

  border-radius: 8px;

  background: #ef4444;

  color: white;

  cursor: pointer;
}

.ban-btn.unban {
  background: #22c55e;
}

.preview-overlay {
  position: fixed;
  inset: 0;

  background: rgba(0, 0, 0, 0.72);

  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 9999;

  padding: 1rem;
}

.preview-modal {
  width: min(900px, 100%);

  max-height: 90vh;

  overflow-y: auto;

  background: linear-gradient(135deg, #1e293b, #0f172a);

  border-radius: 24px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  padding: 2rem;

  color: white;
}

.preview-image {
  width: 100%;

  height: 320px;

  object-fit: cover;

  border-radius: 18px;

  margin-bottom: 1.5rem;
}

.preview-meta {
  opacity: 0.6;

  margin-bottom: 2rem;
}

.preview-content {
  line-height: 1.8;

  white-space: pre-wrap;

  opacity: 0.92;
}

.preview-actions {
  margin-top: 2rem;

  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 1rem;
}

.report-card {
  padding: 16px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1e293b, #0f172a);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: 0.2s;
}

.report-card:hover {
  transform: translateY(-3px);
  border-color: rgba(239, 68, 68, 0.25);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.report-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.report-left,
.report-right {
  display: flex;
  align-items: center;
}

.report-type {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
}

.report-date {
  font-size: 0.8rem;
  opacity: 0.6;
  white-space: nowrap;
}

.report-type.user {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}

.report-type.comment {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.time {
  font-size: 12px;
  opacity: 0.5;
}

.report-target h3 {
  margin: 0;
  font-size: 15px;
}

.report-target p {
  margin: 4px 0 0;
  font-size: 12px;
  opacity: 0.5;
}

.report-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  font-size: 11px;
  opacity: 0.5;
  display: block;
}

.value {
  font-size: 13px;
}

.report-actions {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.view-btn {
  flex: 1;
  padding: 8px;
  border-radius: 10px;
  border: none;
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.action-btn {
  padding: 8px 10px;
  border-radius: 10px;
  border: none;
  color: white;
}

.action-btn.danger {
  background: rgba(239, 68, 68, 0.8);
}

.action-btn.ghost {
  background: rgba(255, 255, 255, 0.06);
}

@media (max-width: 900px) {
  .layout {
    display: flex;
    flex-direction: column;
  }

  .sidebar {
    position: static;
  }

  .articles-table {
    display: block;
    overflow-x: auto;
  }

  .preview-modal {
    padding: 1.25rem;
  }

  .preview-image {
    height: 220px;
  }
}
</style>
