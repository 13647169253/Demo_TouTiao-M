/**
  封装本地存储的模块
 */

// 存储
export const setItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

// 获取
export const getItem = (key) => {
  const data = window.localStorage.getItem(key);
  try {
    // 对JSON格式的字符串进行转换,如果不是JSON格式的字符串则失败会catch
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

// 删除
export const removeItem = (key) => {
  window.localStorage.removeItem(key)
}