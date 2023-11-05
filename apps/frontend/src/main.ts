import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@tabler/core/dist/css/tabler.min.css'
import 'animate.css'
import 'bootstrap'
import './style.css'
import App from './App.vue'

import { router } from './router'

const pinia = createPinia()
const app = createApp(App)
app.use(pinia)
app.use(router)
app.mount('#app')
