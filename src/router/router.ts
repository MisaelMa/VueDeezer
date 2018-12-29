import Vue from 'vue'
import Router from 'vue-router'
import { createStore }  from '../store/store'
const meta = require('./meta.json')
const store =  createStore();
Vue.use(Router)

function route (path: string, view: any, auth: { (to: any, from: any, next: { (): void; (arg0: string): void; }): void; (to: any, from: any, next: { (): void; (arg0: string): void; }): void; (to: any, from: any, next: { (): void; (arg0: string): void; }): void; }) {
  return {
    path: path,
    meta: meta[path],
    component: () => import(`../views/${view}`),
    beforeEnter: auth
  }
}


const ifNotAuthenticated = (to: any, from: any, next: { (): void; (arg0: string): void; }) => {
  if (!store.getters.isLoggedIn) {
    next()
    return
  }
  next('/')
}
const ifAuthenticated = (to: any, from: any, next: { (): void; (arg0: string): void; }) => {
  if (store.getters.isLoggedIn) {
    next()
    return
  }
  next('/login')
}

const router =  new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [    
    route('/', 'Home.vue',ifAuthenticated),
    route('/about', 'About.vue',ifAuthenticated),
    route('/login', 'login.vue',ifNotAuthenticated)
  ]
})

export default router
