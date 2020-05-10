import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'


import firebase from 'firebase'
import {firestorePlugin} from 'vuefire'

import VueGoodTablePlugin from 'vue-good-table'
import 'vue-good-table/dist/vue-good-table.css'
import AxiosPlugin from 'vue-axios-cors'
 
Vue.use(VueRouter)
Vue.use(firebase)
Vue.use(firestorePlugin)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueGoodTablePlugin)
Vue.use(AxiosPlugin)

export default new VueRouter({
  routes
})
