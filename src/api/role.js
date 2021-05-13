import request from '@/utils/request'

export function getRoutes() {
  return request({
    url: '/vue-element-admin/routes',
    method: 'get'
  })
}

export function getRoles(token) {
  return request({
    url: '/api/roles',
    method: 'get',
    params: { token }
  })
}

export function addRole(data) {
  return request({
    url: '/api/role',
    method: 'post',
    data
  })
}

export function updateRole(id, data) {
  return request({
    url: `/api/role/${id}`,
    method: 'put',
    data
  })
}

export function deleteRole(id) {
  return request({
    url: `/api/role/${id}`,
    method: 'delete'
  })
}
