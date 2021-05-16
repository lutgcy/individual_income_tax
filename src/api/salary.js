import request from '@/utils/request'

export function generateSalary(token) {
  return request({
    url: '/api/incometax/generate',
    method: 'post',
    params: { token }
  })
}

export function initNextSalary(token) {
  return request({
    url: '/api/salary/initnext',
    method: 'post',
    params: { token }
  })
}

export function generateNextSalary(token) {
  return request({
    url: '/api/salary/generatenext',
    method: 'post',
    params: { token }
  })
}

export function deleteLastSalary(token) {
  return request({
    url: '/api/salary/deletelast',
    method: 'post',
    params: { token }
  })
}

export function searchSalary(condition, pageNum, pageSize, token) {
  return request({
    url: '/api/salary/search',
    method: 'get',
    params: { condition, pageNum, pageSize, token }
  })
}
