import { createWebHistory, createRouter } from 'vue-router'
import AppView from '../App.vue'

const routes = [{ path: '/', component: AppView, name: 'Home' }]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
