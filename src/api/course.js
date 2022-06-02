import request from '@/request/index';

export function submitcomment(data) {
  return reqest({
    url: '/comment/submitcomment',
    method: 'get',
    data,
    headers: {
      uid: 1,
      token: {}
    }
  })
}

// 测试接口
export function StaffNotice(param) {
  return request({
    url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
    data: {
      question_bank_id: 14
    },
    header: {
      token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjUwODY4OTY2fQ=='
    },
  })
}

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

export function courseGetVideoAuth(data) {
  return request({
    url: 'course/getVideoAuth',
    method: 'get',
    data,
    nocatch: true
  })
}

export function courseRecordLearn(data) {
  return request({
    url: 'course/learn',
    method: 'post',
    data,
    loading: false,
    nocatch: true
  })
}

export function courseFavorites(data) {
  return request({
    url: 'course/favorites',
    method: 'post',
    data,
    loading: false
  })
}

