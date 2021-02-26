import Vue from 'vue'
import Router from 'vue-router'
import Gallery from './views/Gallery.vue'
  
import NotFound from './views/NotFound.vue'

Vue.use(Router)

export default new Router({
  //mode: 'history',
  //base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'gallery',
      component: Gallery
    },

     
     
    {
      path: '/*',
      component: NotFound
    },
  ]
})
