/*
 * @Author: Bamboo
 * @AuthorEmail: bamboo8493@126.com
 * @AuthorDescription:
 * @Modifier:
 * @ModifierEmail:
 * @ModifierDescription:
 * @Date: 2020-05-02 20:48:31
 * @LastEditTime: 2020-05-03 01:49:03
 */
// Vuex 集中式存储管理应⽤的所有组件的状态，并以相应的规则保证状态以可预测的⽅式发⽣变化

// 实现⼀个插件：声明Store类，挂载$store
// 单向数据流，不能直接更改 state，只能通过action 或 mutations 进行更改
// components => dispatch => actions => commit => mutations => mutate => state => render => components

import Vue from 'vue'

class Store {
  constructor(options) {
    this.getters = {}
    this.actions = options.actions
    this.mutations = options.mutations

    // 借用 Vue 进行响应式 state，$$ 对 options.state 不进行响应式，保证外部 无法更改 state
    this._vm = new Vue({
      data: {
        $$state: options.state
      },
      // 将 getters 挂载 Vue 到 计算对象 上，实现 getters 响应式
      computed: this.getComputedByGetters(options.getters)
    })

    // 绑定 this
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state() {
    return this._vm._data.$$state
  }

  set state(val) {
    throw new Error("please use action or mutation to change state")
  }

  getComputedByGetters(getters) {
    const computed = {}

    for (let key in getters) {
      computed[key] = () => getters[key](this.state, this.getters)

      Object.defineProperty(this.getters, key, {
        get: () => this._vm[key],
        enumerable: true
      })
    }

    return computed
  }

  // 实现commit根据⽤户传⼊type执⾏对应mutation
  commit(type, payload) {
    const entry = this.mutations[type]
    if (typeof entry !== 'function') {
      throw new Error('未知的mutation: ' + type)
    }

    // 将state作为上下文
    entry(this.state, payload)
  }

  // 实现dispatch根据⽤户传⼊type执⾏对应action，同时传递上下⽂
  dispatch(type, payload) {
    const entry = this.actions[type]
    if (typeof entry !== 'function') {
      throw new Error('未知的action: ' + type)
    }

    // 将当前实例作为上下文，注意 this 指向问题
    entry(this, payload)
  }
}

function install(Vue) {
  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

export default { Store, install }
