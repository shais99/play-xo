import Vue from 'vue'
import VueRouter from 'vue-router'
import HomePage from '../views/HomePage'
import PlayGamePage from '../views/PlayGamePage'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage,
    meta: {
      title: 'Let\'s play X/O :)'
    }
  },
  {
    path: '/play/:id?',
    name: 'PlayGame',
    component: PlayGamePage,
    meta: {
      title: 'Play Game!'
    }
  }
]

const router = new VueRouter({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes
})

export default router
