import VueRouter from 'vue-router';

import PredefinedView from '../components/PredefinedView.vue';
import DetailView from '../components/DetailView.vue';
import LoginView from '../components/Login/LoginView.vue';

import store from '../store/store';
import constants from '../constants';

const authServer = `${constants.esapi}/auth`;

const router = new VueRouter({
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
    {
      path: '/login',
      component: LoginView,
      name: 'login',
    },
  ],
});

router.beforeEach(async (to, from, next) => {
  let token = localStorage.getItem('token');
  let valid = false;

  if (token) {
    let validCheck = await fetch(`${authServer}/validate/${token}`);
    if (validCheck.status === 200) {
      validCheck = await validCheck.json();
      valid = validCheck.data.valid;
      if (validCheck.data.data)
        store.dispatch('updateUserData', validCheck.data.data);
    } else {
      // store.dispatch(
      //   'fatalError',
      //   `${validCheck.status} - ${validCheck.statusText}`
      // );
    }
  }

  if (!valid && to.name !== 'login') {
    localStorage.removeItem('token');
    // store.dispatch('updateToken');
    next({ name: 'login' });
  } else if (!valid && to.name === 'login') {
    next();
  } else if (valid && to.name === 'login') {
    next({ name: 'home' });
  } else next();
});

export default router;
