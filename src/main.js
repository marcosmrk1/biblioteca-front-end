import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { router } from './routes'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy'
import 'tippy.js/dist/tippy.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(VueTippy, {
  directive: 'tippy', // nome da diretiva (v-tippy)
  component: 'tippy', // nome do componente (Tippy)
  componentSingleton: 'tippy-singleton',
  defaultProps: {
    placement: 'top',
    allowHTML: true,
    animation: 'shift-away',
    theme: 'light-border',
  },
})

app.use(router)
app.mount('#app')
