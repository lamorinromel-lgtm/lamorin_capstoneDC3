import { createRouter, createWebHistory } from 'vue-router'

import Home from '../views/home.vue'
import Dashboard from '../views/dashboard.vue'
import Inventory from '../views/inventory.vue'
import Sales from '../views/sales.vue'
import About from '../views/about.vue'

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/dashboard',
    component: Dashboard
  },
  {
    path: '/inventory',
    component: Inventory
  },
  {
    path: '/sales',
    component: Sales
  },
  {
    path: '/about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router