import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    userdata: null,
    carcache: [],
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERDATA(state, payload) {
      state.userdata = payload;
    },
    CACHE_CAR(state, payload) {
      state.carcache.push(payload);
    },
  },
  actions: {
    updateToken(ctx) {
      ctx.commit('SET_TOKEN', localStorage.getItem('token'));
    },

    updateUserData(ctx, payload) {
      ctx.commit('SET_USERDATA', payload);
    },
    cacheCar(ctx, payload) {
      console.log(`Store Dispatch`, payload);
      ctx.commit('CACHE_CAR', payload);
    },
  },
  modules: {},
});
