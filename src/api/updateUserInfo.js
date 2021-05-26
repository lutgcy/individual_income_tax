import request from '@/utils/request'

export function updateAdminInfo(data) {
  return request({
    url: '/api/update/info/admin',
    method: 'post',
    data
  })
}

export function getHrByUsername(username, token) {
  return request({
    url: '/api/hr/username',
    method: 'get',
    params: { username, token }
  })
}

export function getEmployeeByUsername(username, token) {
  return request({
    url: '/api/employee/username',
    method: 'get',
    params: { username, token }
  })
}
