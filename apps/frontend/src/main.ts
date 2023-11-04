import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@tabler/core/dist/css/tabler.min.css'
import './style.css'
import 'bootstrap'
import App from './App.vue'

import { router } from './router'

const pinia = createPinia()
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
