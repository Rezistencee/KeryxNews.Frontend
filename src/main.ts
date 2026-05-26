import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.ts'

const app = createApp(App)

app.use(createPinia())

const auth = useAuthStore()

await auth.fetchMe()

app.use(router)

app.mount('#app')
