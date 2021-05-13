import request from '@/utils/request'

export function getPosts(pageNum, pageSize, token) {
  return request({
    url: '/api/posts',
    method: 'get',
    params: { pageNum, pageSize, token }
  })
}

export function addPost(data) {
  return request({
    url: '/api/post',
    method: 'post',
    data
  })
}

export function deletePost(pks) {
  return request({
    url: '/api/post/delete',
    method: 'post',
    data: pks
  })
}

export function updatePost(post) { // post: 岗位
  return request({
    url: '/api/post/update',
    method: 'post',
    data: post
  })
}

export function getAllDept(token) {
  return request({
    url: '/api/dept/options',
    method: 'get',
    params: { token }
  })
}
