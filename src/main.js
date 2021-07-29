import Vue from './elements';
import App from './App.vue';

import VueRouter from 'vue-router';
import router from './router/router';
import store from './store/store';

Vue.use(VueRouter);
Vue.config.productionTip = false;

import './assets/styles/index.css';

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
