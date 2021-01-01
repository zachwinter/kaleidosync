import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import VueAnalytics from 'vue-analytics'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
  faUser,
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faEllipsisVAlt,
  faPlus,
  faExpand,
  faTimes,
  faSlidersH,
  faChevronRight,
  faChevronLeft,
  faEnvelope,
  faSyncAlt,
  faCog
} from '@fortawesome/pro-light-svg-icons'
import { faSpotify, faInstagram, faTelegram, faGithub } from '@fortawesome/free-brands-svg-icons'
import Icon from '@/components/common/Icon'

Vue.config.productionTip = false

;[
  faUser,
  faPlay,
  faPause,
  faStepForward,
  faStepBackward,
  faEllipsisVAlt,
  faPlus,
  faExpand,
  faTimes,
  faSlidersH,
  faChevronRight,
  faChevronLeft,
  faSpotify,
  faInstagram,
  faEnvelope,
  faTelegram,
  faGithub,
  faSyncAlt,
  faCog
].forEach(icon => library.add(icon))

Vue.component('Icon', Icon)

// eslint-disable-next-line 
if (PRODUCTION && GOOGLE_ANALYTICS) {
  Vue.use(VueAnalytics, {
    // eslint-disable-next-line 
    id: GOOGLE_ANALYTICS,
    router
  })
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')