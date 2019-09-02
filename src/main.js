import 'proxy-polyfill/src/proxy.js'

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './vuex'
import VueAnalytics from 'vue-analytics'

// eslint-disable-next-line 
if (GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    // eslint-disable-next-line 
    id: GOOGLE_ANALYTICS
  })
}

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
