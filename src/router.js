import VueRouter from 'vue-router';

import PredefinedView from './components/PredefinedView.vue';
import DetailView from './components/DetailView.vue';

export default new VueRouter({
  routes: [
    {
      path: '/',
      component: PredefinedView,
      name: 'home',
    },
    {
      path: '/details/:type/:id',
      component: DetailView,
      name: 'details',
    },
  ],
});
