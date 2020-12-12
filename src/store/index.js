import Vue from 'vue'
import Vuex from 'vuex'
// 导入封装好的本地存储方法
import { setItem, getItem, removeItem } from '@/utils/storage'


Vue.use(Vuex)

const toKen_key = `User_key`

export default new Vuex.Store({
  state: {
    // 存储用户信息,包含token等
    user: getItem(toKen_key)
    // user: JSON.parse(window.localStorage.getItem(toKen_key))
  },
  mutations: {
    setUser(state, data) {
      state.user = data
      // window.localStorage.setItem(toKen_key, JSON.stringify(state.user))
      setItem(toKen_key, state.user)
    }
  },
  actions: {
  },
  modules: {
  }
})
