import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Visualizer from '@/views/Visualizer'
import Privacy from '@/views/Privacy'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/visualizer',
    name: 'Visualizer',
    component: Visualizer
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: Privacy 
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
