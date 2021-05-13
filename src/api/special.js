import request from '@/utils/request'

export function getSpecials(pageNum, pageSize, token) {
  return request({
    url: '/api/specials',
    method: 'get',
    params: { pageNum, pageSize, token }
  })
}

export function generate(token) {
  return request({
    url: '/api/generatespecial',
    method: 'post',
    params: { token }
  })
}

export function searchSpecial(condition, pageNum, pageSize, token) {
  return request({
    url: '/api/special/search',
    method: 'get',
    params: { condition, pageNum, pageSize, token }
  })
}
