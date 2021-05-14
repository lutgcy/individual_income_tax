import request from '@/utils/request'

export function generateTax(token) {
  return request({
    url: '/api/incometax/generate',
    method: 'post',
    params: { token }
  })
}

export function searchTaxDetail(condition, pageNum, pageSize, token) {
  return request({
    url: '/api/tax/search',
    method: 'get',
    params: { condition, pageNum, pageSize, token }
  })
}
