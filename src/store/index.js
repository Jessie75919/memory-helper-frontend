import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import StorageHelper from '@/helpers/StorageHelper';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    access_token: StorageHelper.get('access_token'),
    refresh_token: StorageHelper.get('refresh_token'),
    is_loading: true,
  },
  getters:{
    isAuthenticated:(state) => {
      return Boolean(state.access_token);
    },
    loading: (state) => state.is_loading
  },
  mutations: {
    storeToken: (state, token) => {
      const {access, refresh} = token;
      state.access_token = access;
      state.refresh_token = refresh;
      StorageHelper.set('access_token', access);
      StorageHelper.set('refresh_token', refresh);
    },
    removeToken: (state) => {
      state.access_token = null;
      state.refresh_token = null;
      StorageHelper.clear();
    },
    startLoading:(state) => state.is_loading = true,
    stopLoading:(state) => state.is_loading = false,
  },
  actions: {
    login(context, payload) {
      axios.post('/api/token/', payload).then(res => {
        let token = res.data;
        context.commit('storeToken', token);
        window.location.href = '/review';
      }).catch(err => {
        console.log(err);
      });
    },
    logout(context){
      context.commit('removeToken');
      window.location.href = '/login';
    }
  },
  modules: {},
});
