import request from '@/request/index'

export function systemConfig() {
  return request({
    url: 'index/site',
    method: 'get'
  })
}


export function systemRegion(data) {
  return request({
    url: 'index/systemRegion',
    method: 'get',
    data
  })
}
