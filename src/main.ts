import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router/router'
import { createStore }  from './store/store'
import './registerServiceWorker'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'

Vue.prototype.$http = require('axios')
Vue.config.productionTip = false
const store =  createStore();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
