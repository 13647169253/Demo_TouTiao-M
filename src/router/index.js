import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 路由表
const routes = [
  {
    path: '/login',
    name: 'login',
    // @ 代表src目录下进行查找
    component: () => import('@/views/login')
  },
  {
    path: '/',
    // name: '/layout', 有默认为子路由的父级路由的name属性没有意义
    // @ 代表src目录下进行查找
    component: () => import('@/views/layout'),
    children: [
      {
        path: '', // 留空为默认子路由;只能配置一个
        name: 'home',
        component: () => import('@/views/home')
      }, {
        path: '/qa',
        name: 'qa',
        component: () => import('@/views/qa')
      }, {
        path: '/video',
        name: 'video',
        component: () => import('@/views/video')
      }, {
        path: '/my',
        name: 'my',
        component: () => import('../views/my')
      },

    ]
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/search')
  },
]

const router = new VueRouter({
  routes
})

export default router
