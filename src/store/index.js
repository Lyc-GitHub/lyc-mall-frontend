import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: localStorage.getItem('token') || '',
    username: localStorage.getItem('username') || ''
  },
  mutations: {
    SET_TOKEN(state, token) {
      state.token = token
      localStorage.setItem('token', token)
    },
    SET_USERNAME(state, username) {
      state.username = username
      localStorage.setItem('username', username)
    },
    CLEAR_TOKEN(state) {
      state.token = ''
      state.username = ''
      localStorage.removeItem('token')
      localStorage.removeItem('username')
    }
  },
  actions: {
    setToken({ commit }, token) {
      commit('SET_TOKEN', token)
    },
    setUsername({ commit }, username) {
      commit('SET_USERNAME', username)
    },
    clearToken({ commit }) {
      commit('CLEAR_TOKEN')
    }
  },
  getters: {
    token: state => state.token,
    username: state => state.username
  }
})