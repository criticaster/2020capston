import Vue from 'vue'
import App from './App'

import router from './router'
import 'expose-loader?$!expose-loader?jQuery!jquery'


/* eslint-disable no-new */
new Vue({
  el: '#app',
  
  router,
  render: h => h(App)
})


