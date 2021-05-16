import request from '@/utils/request'

export function getEmps(pageNum, pageSize, token) {
  return request({
    url: '/api/emps',
    method: 'get',
    params: { pageNum, pageSize, token }
  })
}

export function searchEmployee(condition, pageNum, pageSize, token) {
  return request({
    url: '/api/employee/search',
    method: 'get',
    params: { condition, pageNum, pageSize, token }
  })
}

export function addEmp(data) {
  return request({
    url: '/api/emp',
    method: 'post',
    data
  })
}

export function deleteEmp(pks) {
  return request({
    url: '/api/emp/delete',
    method: 'post',
    data: pks
  })
}

export function updateEmp(emp) { // emp: 岗位
  return request({
    url: '/api/emp/update',
    method: 'post',
    data: emp
  })
}

export function getAllDeptIdAndName(token) {
  return request({
    url: '/api/dept/options',
    method: 'get',
    params: { token }
  })
}

export function getAllPostIdAndName(token) {
  return request({
    url: '/api/post/options',
    method: 'get',
    params: { token }
  })
}
