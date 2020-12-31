import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '@/views/Home'
import Visualizer from '@/views/Visualizer'

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
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
