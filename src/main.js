import 'proxy-polyfill/src/proxy.js'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faTrash, faSyncAlt } from '@fortawesome/free-solid-svg-icons'

library.add(faTrash)
library.add(faSyncAlt)

Vue.component('icon', FontAwesomeIcon)

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
