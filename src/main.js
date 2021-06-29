import Vue from './elements';
import App from './App.vue';

import VueRouter from 'vue-router';
import router from './router';

Vue.use(VueRouter);

Vue.config.productionTip = false;

import './assets/styles/index.css';

new Vue({
  router,
  render: (h) => h(App),
}).$mount('#app');
