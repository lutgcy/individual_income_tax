import request from '@/utils/request'

export function updatePassword(oldPassword, newPassword, token) {
  return request({
    url: '/api/password/update',
    method: 'post',
    data: { oldPassword, newPassword, token }
  })
}

export function resetHrPassword(pks) {
  return request({
    url: '/api/password/reset/hr',
    method: 'post',
    data: pks
  })
}

export function resetEmpPassword(pks) {
  return request({
    url: '/api/password/reset/emp',
    method: 'post',
    data: pks
  })
}
