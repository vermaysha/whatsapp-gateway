import { createApp } from 'vue'
import '@tabler/core/dist/css/tabler.min.css'
import './style.css'
import 'bootstrap'
import App from './App.vue'

import { router } from './router'

const app = createApp(App)
app.use(router)
app.mount('#app')
