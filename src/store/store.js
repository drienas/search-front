import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    token: null,
    userdata: null,
  },
  mutations: {
    SET_TOKEN(state, payload) {
      state.token = payload;
    },
    SET_USERDATA(state, payload) {
      state.userdata = payload;
    },
  },
  actions: {
    updateToken(ctx) {
      ctx.commit('SET_TOKEN', localStorage.getItem('token'));
    },

    updateUserData(ctx, payload) {
      ctx.commit('SET_USERDATA', payload);
    },
  },
  modules: {},
});
