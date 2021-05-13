import request from '@/utils/request'

export function getHrs(pageNum, pageSize, token) {
  return request({
    url: '/api/hrs',
    method: 'get',
    params: { pageNum, pageSize, token }
  })
}

export function addHr(data) {
  return request({
    url: '/api/hr',
    method: 'post',
    data
  })
}

export function deleteHr(pks) {
  return request({
    url: '/api/hr/delete',
    method: 'post',
    data: pks
  })
}

export function updateHr(hr) {
  return request({
    url: '/api/hr/update',
    method: 'post',
    data: hr
  })
}
