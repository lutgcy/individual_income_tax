import request from '@/utils/request'

export function getDepts(pageNum, pageSize, token) {
  return request({
    url: '/api/depts',
    method: 'get',
    params: { pageNum, pageSize, token }
  })
}

export function addDept(data) {
  return request({
    url: '/api/dept',
    method: 'post',
    data
  })
}

export function deleteDept(pks) {
  return request({
    url: '/api/dept/delete',
    method: 'post',
    data: pks
  })
}

export function updateDept(dept) {
  return request({
    url: '/api/dept/update',
    method: 'post',
    data: dept
  })
}
