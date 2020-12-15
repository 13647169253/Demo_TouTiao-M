import Vue from 'vue'

import dayjs from 'dayjs'

// 默认为英文,先配置为中文,加载中文语言宝
import 'dayjs/locale/zh-cn'

// 配置处理相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.extend(relativeTime)

dayjs.locale('zh-cn')


// 定义全局过滤器
Vue.filter('relativeTime', value => {
  return dayjs().to(dayjs(value))
});