import request from '@/utils/request'

export function login(data, loginUrl) {
  return request({
    url: loginUrl,
    method: 'post',
    data
  })
}

export function getInfo(token, getInfoUrl) {
  return request({
    url: getInfoUrl,
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/api/logout',
    method: 'post'
  })
}
