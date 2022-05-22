import request from '@/request/index'



// 获取系统公告详情
export function getAnnouncementInfo(data) {
  return request({
    url: 'http://testadmin.beiqujy.com/apidata/admin/v2/Workbench/getAnnouncementInfo',
    method: 'get',
    data,
    loading: true
  })
}



// 获取地区配置
export function systemRegion(data) {
  return request({
    url: 'index/systemRegion',
    method: 'get',
    data
  })
}
