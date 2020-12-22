/* 
  评论请求模块 
*/

import request from '../utils/request'

/* 
  获取评论及评论回复
  GET参数使用 params 进行传递;传入时候是对象,但是最终发送给后端的数据回经过axios转为Key=value的url格式发送 
  但是在url中将数据进行了编码引号,所以在请求时手动进行 toString
*/
export const getComments = params => {
  return request({
    method: 'GET',
    url: '/app/v1_0/comments',
    params
  })
}

// 评论及评论回复点赞
export const addCommentLike = target => {
  return request({
    method: 'POST',
    url: '/app/v1_0/comment/likings',
    data: { target }
  })
}

// 评论及评论回复取消点赞
export const deleteCommentLike = target => {
  return request({
    method: 'DELETE',
    url: `/app/v1_0/comment/likings/${target}`,
  })
}

// 发布评论
export const addComment = data => {
  return request({
    method: 'POST',
    url: `/app/v1_0/comments`,
    data
  })
}