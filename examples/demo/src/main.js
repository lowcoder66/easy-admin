import Vue from 'vue'
import App from './App.vue'
import store from './store'
import i18n from './plugins/i18n'
import router from './router'
import admin from './plugins/admin'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false

new Vue({
  store,
  i18n,
  router,
  admin,
  vuetify,
  render: h => h(App)
}).$mount('#app')
