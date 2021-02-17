import Vue from 'vue'
import Router from 'vue-router'
import Wallet from './views/Wallet.vue'
 
import Landing from './views/Landing.vue' 
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'landing',
      component: Landing
    },

    {
      path: '/#',
      name: 'landing',
      component: Landing
    },
    {
      path: '/wallet',
      name: 'wallet',
      component: Wallet,
    },
     
    {
      path: '/*',
      component: NotFound
    },
  ]
})
