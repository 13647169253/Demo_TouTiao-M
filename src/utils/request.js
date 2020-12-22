/**
 * 封装 axios 请求模块
 */
import axios from "axios"
import store from '@/store'
// 处理大数据问题,超出javascript 安全整数范围的问题
import JSONBig from 'json-bigint'


const request = axios.create({
  baseURL: "http://ttapi.research.itcast.cn/", // 基础路径
  // 自定义后端返回的原数据,
  transformResponse: [function (data) {
    // axios 默认会在内部使用 JSON.parse 处理后端返回的结果.
    try {
      return JSONBig.parse(data)
    } catch (err) {
      // console.log(err);
      return data
    }
  }]
})

// 请求拦截器 ; 我们使用request进行请求
request.interceptors.request.use(function (config) {
  // config ：本次请求的配置对象
  // config 里面有一个属性：headers
  const { user } = store.state
  if (user && user.token) {
    // 给config对象统一加上token
    config.headers.Authorization = `Bearer ${user.token}`
  }
  // config 放行标记,如果没有return出去请求会滞留。
  return config
}, function (error) {
  // 请求本身错误,还没发出请求发生的错误.
  return Promise.reject(error)
})

// 响应拦截器
export default request