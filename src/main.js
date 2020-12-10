import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式表
import './styles/index.css'
// 导入Vant组件库及样式
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入动态设置Rem基准值amfe-flexible插件
import 'amfe-flexible'

// 全局注册Vant组件库
Vue.use(Vant)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
