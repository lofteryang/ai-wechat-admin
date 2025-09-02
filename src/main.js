/*
 * @Author: your name
 * @Date: 2021-05-26 15:30:28
 * @LastEditTime: 2021-07-28 12:39:17
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /admin/src/main.js
 */
import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import ElementUI from 'element-ui'
import treeTransfer from 'el-tree-transfer'
import 'element-ui/lib/theme-chalk/index.css'
import './styles/index.css'

import App from './App'
import router from './router'
import store from './store'
import api from './config/api'
// vue-quill-edit
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// element-ui 跟 bootstrap css 有冲突
// import 'bootstrap/js/modal.js'
// import 'bootstrap/js/dropdown.js'
// import 'bootstrap/js/tooltip.js'
// // import 'bootstrap/dist/css/bootstrap.css'
// import 'font-awesome/css/font-awesome.css'
// import 'summernote'
// import 'summernote/dist/lang/summernote-zh-CN.js'
// import 'summernote/dist/summernote.css'

Vue.use(VueAxios, axios)
Vue.use(ElementUI)

// add设置调试模式
Vue.config.devtools = true
// Vue.config.devtools = __ENV__.NODE_ENV !== 'production';

router.beforeEach((to, from, next) => {
  let token = localStorage.getItem('token') || ''

  //配置接口信息
  // Axios.defaults.baseURL = 'http://www.地址.com:8360/admin/';
  axios.defaults.baseURL = api.rootUrl
  axios.defaults.headers.common['X-Nideshop-Token'] = token

  if (!token && to.name !== 'login') {
    next({
      path: '/login',
      query: {
        redirect: to.fullPath,
      },
    })
  } else {
    next()
  }
})

if (!process.env.IS_WEB) {
  // Vue.use(require('vue-electron'))
}
Vue.config.productionTip = false
Vue.prototype.$axios = axios

new Vue({
  el: '#app',
  data: {},
  router,
  store,
  render: (h) => h(App),

  mounted: function () {},
}).$mount('#app')
