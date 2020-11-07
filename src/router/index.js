import Vue from 'vue'
import AhaRouter from '../aha-router'
import Home from '../views/Home.vue'

Vue.use(AhaRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter (from, to, next) {
      console.log('beforeEnter', from, to)
      next()
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new AhaRouter({
  routes
})

export default router
