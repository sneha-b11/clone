import Vue from 'vue'
import {auth} from '@/firebase/firebaseInit.js';
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import login from '../views/Login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: login,
  },
  {
    path: "/passwordReset",
    name: "passwordReset",
    component: () =>  import ('@/components/PasswordReset.vue'),
    meta: {
        requiresAuth : false    
    }
  }, 
  {
    path: '/',
    name: 'Home',
    component: Home,
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

const router = new VueRouter({
  mode: "history",
    base: process.env.BASE_URL,
  routes
})


router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth)

  if (requiresAuth && !auth.currentUser) {
    next('/')
  } else {
    next()
  }
})

export default router
