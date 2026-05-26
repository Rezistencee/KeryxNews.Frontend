import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ArticleView from '@/views/ArticleView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useAuthStore } from '@/stores/auth'
import UserProfileView from '@/views/UserProfileView.vue'
import AuthorArticlesView from '@/views/AuthorArticlesView.vue'
import AdminView from '@/views/AdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
    },
    {
      path: '/profile/:id',
      name: 'profile',
      component: UserProfileView,
    },
    {
      path: '/articles',
      name: 'articles',
      component: ArticlesView,
    },
    {
      path: '/articles/:id',
      name: 'article',
      component: ArticleView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
      meta: {
        requiresAuth: true,
      },
    },
    {
      path: '/my-articles',
      name: 'my-articles',
      component: AuthorArticlesView,
      meta: {
        requiresAuth: true,
        roles: ['Author'],
      },
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      meta: {
        requiresAuth: true,
        roles: ['Admin'],
      },
    },
  ],
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/auth'
  }

  const roles = to.meta.roles as string[] | undefined

  if (roles && !roles.some((role) => auth.hasRole(role))) {
    return '/'
  }
})

export default router
