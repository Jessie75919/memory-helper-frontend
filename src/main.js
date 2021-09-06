import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import {axiosSetConfig} from '@/settings/axios_settings';

Vue.config.productionTip = false;

axiosSetConfig()

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App),
}).$mount('#app');
