import request from '@/utils/request'

export function getPieData(token) {
  return request({
    url: '/api/echarts/pie',
    method: 'get',
    params: { token }
  })
}

export function getHistogramData(token) {
  return request({
    url: '/api/echarts/histogram',
    method: 'get',
    params: { token }
  })
}

export function getLineData(token) {
  return request({
    url: '/api/echarts/line',
    method: 'get',
    params: { token }
  })
}
