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


export function banner(data) {
  return request({
    url: 'index/banner',
    method: 'get',
    data
  })
}

export function articleList(data) {
  return request({
    url: 'article/articleList',
    method: 'get',
    data
  })
}

export function articleDetail(data) {
  return request({
    url: 'article/detail',
    method: 'post',
    data
  })
}

export function libraryList(data) {
  return request({
    url: 'library/libraryList',
    method: 'get',
    data
  })
}

export function libraryDetail(data) {
  return request({
    url: 'library/detail',
    method: 'post',
    data
  })
}

export function courseList(data) {
  return request({
    url: 'course/list',
    method: 'get',
    data
  })
}