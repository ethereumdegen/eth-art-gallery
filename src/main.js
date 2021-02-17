import Vue from 'vue'
import VueTailwind from 'vue-tailwind'

import App from './App.vue'
import router from './router'

import './css/main.css'
import './css/github-markdown.css'
import './css/whitespace.scss'


Vue.config.productionTip = false

Vue.use(VueTailwind)

 

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
