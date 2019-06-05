// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store/index'
import router from './router'

import Mint from 'mint-ui';
Vue.use(Mint);

import Adapt from './public/adapt'

Vue.config.productionTip = false

Adapt(window).resize(375,'',480)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
