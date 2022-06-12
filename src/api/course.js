import request from '@/request/index';

// API docs http://showdoc.beiqujy.com/web/#/44 

// 课程分类
 export function courseCategory(data) {
  return request({
    url: 'course/category',
    method: 'get',
    data,
  })
}

 export function coursePriceType(data) {
  return request({
    url: 'course/priceType',
    method: 'get',
    data,
  })
}

// 课程列表
 export function courseList(data) {
  return request({
    url: 'course/list',
    method: 'get',
    data
  })
}

//  课程信息
 export function courseInfo(data) {
  return request({
    url: 'course/info',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 章节目录
 * @param {*} data {course_id: 课程id}
 * @returns 
 */
export function courseChapterList(data) {
  return request({
    url: 'course/chapter',
    method: 'get',
    data,
    loading: true
  })
}

// 评价热刺
export function courseCommentHotWord() {
  return request({
    url: 'course/commentHotWord',
    method: 'get'
  })
}

/**
 * 课程评价列表
 * @param {*} data {page: 当前分页, course_id: 课程id}
 * @returns 
 */
 export function courseGetCommentList(data) {
  return request({
    url: 'course/commentList',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程评价详情 评价统计
 */
 export function courseCommentCount(data) {
  return request({
    url: 'course/commentCount',
    method: 'get',
    data
  })
}

// 发表评论
export function courseCommentSubmit(data) {
  return request({
    url: 'course/commentSubmit',
    method: 'post',
    data
  })
}

// 获取视频播放凭证
export function courseGetVideoAuth(data) {
  return request({
    url: 'course/getVideoAuth',
    method: 'get',
    data,
    loading: false,
    nocatch: true
  })
}

// 学习记录 
export function courseRecordLearn(data) {
  return request({
    url: 'course/learn',
    method: 'post',
    data,
    loading: false,
    nocatch: true
  })
}

// 收藏课程
export function courseFavorites(data) {
  return request({
    url: 'course/favorites',
    method: 'post',
    data,
    loading: false
  })
}

// 人脸验证
export function faceUpload(data) {
  return request({
    url: 'course/faceUpload',
    method: 'post',
    data,
    loading: false,
    nocatch: true
  })
}

// 生成证书
export function buildLearnCert(data) {
  return request({
    url: 'course/buildLearnCert',
    method: 'post',
    data,
    loading: false,
  })
}

