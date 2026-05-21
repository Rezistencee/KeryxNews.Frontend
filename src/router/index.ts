import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import AuthView from '@/views/AuthView.vue'
import ArticleView from '@/views/ArticleView.vue'
import ArticlesView from '@/views/ArticlesView.vue'
import SettingsView from '@/views/SettingsView.vue'
import { useAuthStore } from '@/stores/auth'
import UserProfileView from '@/views/UserProfileView.vue'

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
      beforeEnter: () => {
        const auth = useAuthStore()

        if (!auth.user) {
          return '/auth'
        }
      },
    },
  ],
})

export default router
