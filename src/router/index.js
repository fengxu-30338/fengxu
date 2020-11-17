import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Problem from '../views/ProblemPage.vue'
import Resolve from '../views/ResolvePage.vue'
import Test from '../views/TestPage.vue'
import Show from '../views/ShowPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/problem/:type',
    name: 'Problem',
    component: Problem
  },
  {
    path: '/resolve',
    name: 'Resolve',
    component: Resolve
  },
  {
    path: '/resolve/test',
    name: 'Test',
    component: Test
  },
  {
    path: '/resolve/showExam',
    name: 'Show',
    component: Show
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
