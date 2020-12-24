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

// 获取用户信息
export const getUserChannels = () => {
  return request({
    method: 'GET',
    url: '/app/v1_0/user/channels'
  })
}

// 关注用户
export const addFollow = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/followings',
    data: {
      target
    }
  })
}

// 取消关注用户
export const deleteFollow = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/user/followings/${target}`,
  })
}

// 获取当前登录用户资料
export const getUserProfile = target => {
  return request({
    method: 'GET',
    url: `/app/v1_0/user/profile`,
  })
}

// 更新当前登录用户资料
export const updateUserProfile = data => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/profile`,
    data
  })
}

// 更新当前登录用户头像资料
export const updateUserPhoto = data => {
  return request({
    method: 'PATCH',
    url: `/app/v1_0/user/photo`,
    data
  })
}