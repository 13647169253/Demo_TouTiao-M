/**
 * 用户相关的请求模块
 */

import request from '@/utils/request'
// import store from '@/store'


// 请求验证码
export const sendSms = mobile => {
  return request({
    method: 'GET',
    url: `/app/v1_0/sms/codes/${mobile}`
  })
}

// 登录
export const login = data => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data
  })
}

// 获取用户信息
export const getUserInfo = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user'
    // 设置请求头;传递符合规范的token
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`
    // }
  })
}