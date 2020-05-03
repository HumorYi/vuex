/*
 * @Author: Bamboo
 * @AuthorEmail: bamboo8493@126.com
 * @AuthorDescription:
 * @Modifier:
 * @ModifierEmail:
 * @ModifierDescription:
 * @Date: 2020-05-02 19:25:39
 * @LastEditTime: 2020-05-03 01:40:26
 */
import Vue from 'vue'
import Vuex from './vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    counter: 0
  },
  mutations: {
    add(state) {
      // state是哪来的？
      state.counter++
    }
  },
  getters: {
    doubleCount: (state, getters) => state.counter * 2
  },
  actions: {
    add({ commit }) {
      // 上面的上下文是哪来的？它是什么
      setTimeout(() => {
        commit('add')
      }, 1000);
    }
  },
  modules: {}
})

export default store