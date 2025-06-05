import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Races from '../views/Races.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/races', component: Races }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router