import request from '@/utils/request'

export function searchAddApply(condition, pageNum, pageSize, token) {
  return request({
    url: '/api/additionapply/search',
    method: 'get',
    params: { condition, pageNum, pageSize, token }
  })
}

export function setZero() {
  return request({
    url: '/api/addition/setzero',
    method: 'post'
  })
}

export function downloadApplyFile(data) {
  return request({
    url: '/api/addition/download',
    method: 'post',
    data,
    responseType: 'blob'
  })
}

export function agreeApply(data) {
  return request({
    url: '/api/addition/agree',
    method: 'post',
    data
  })
}

export function rejectApply(data) {
  return request({
    url: '/api/addition/reject',
    method: 'post',
    data
  })
}

export function deleteApply(data) {
  return request({
    url: '/api/addition/delete',
    method: 'post',
    data
  })
}


