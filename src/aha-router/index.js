let Vue
class AhaRouter {
  static install (_Vue) {
    Vue = _Vue
    Vue.mixin({
      beforeCreate () {
        console.log(this.$options)
        if (this.$options.router) {
          // 这是入口
          this.$options.router.init()
          Vue.prototype.$router = this.$options.router
        }
      }
    })
  }

  constructor (options) {
    this.$options = options
    this.routeMap = {}
    this.app = new Vue({
      data: {
        current: '/'
      }
    })
  }

  init () {
    // 启动整个路由
    // 由插件sue负责启动
    // 1. 监听hashchange事件
    this.bindEvents()
    // 2. 初始化路由表
    this.createRouteMap()
    console.log('routeMap', this.routeMap)
    // 3. 初始化组件 router-view router-link
    this.initComponent()
  }

  bindEvents () {
    console.log('绑定事件')
    window.addEventListener('hashchange', this.onHashChange.bind(this), false)
    window.addEventListener('load', this.onHashChange.bind(this), false)
  }

  createRouteMap () {
    this.$options.routes.forEach(item => {
      this.routeMap[item.path] = item
    })
  }

  initComponent () {
    Vue.component('router-view', {
      render: h => {
        const component = this.routeMap[this.app.current].component
        return h(component)
      }
    })

    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        // h => CreateElement
        // h三个参数，组件名，参数，子元素
        return h('a', {
          attrs: {
            href: `#${this.to}`
          }
        }, [this.$slots.default]) // 默认插槽
      }
      // template 最终也是转成render
      // template: '<a :href="to"><slot></slot></a>'
    })
  }

  getHash () {
    return window.location.hash.slice(1) || '/'
  }

  push (url) {
    // push
    window.location.hash = url

    // history
  }

  getFrom (e) {
    let from, to
    if (e.newURL) {
      from = e.newURL.split('#')[1]
      to = e.oldURL.split('#')[1]
    } else {
      from = ''
      to = this.getHash()
    }
    return { from, to }
  }

  onHashChange (e) {
    // 获取当前hash值
    const hash = this.getHash()

    const router = this.routeMap[hash]
    const { from, to } = this.getFrom(e)
    // 路由钩子
    if (router.beforeEnter) {
      router.beforeEnter(from, to, () => {
        this.app.current = hash
      })
    } else {
      this.app.current = hash
    }
    console.log('hash 改变了', e)
  }
}

export default AhaRouter
