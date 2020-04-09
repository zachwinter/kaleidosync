import 'proxy-polyfill/src/proxy.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'

Vue.config.productionTip = false

// eslint-disable-next-line 
if (PRODUCTION && GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    // eslint-disable-next-line 
    id: GOOGLE_ANALYTICS
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
