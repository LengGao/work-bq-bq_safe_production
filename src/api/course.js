import reqest from '@/request/index';

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

/**
 * 课程评价列表
 * @param {*} data {page: 当前分页, course_id: 课程id}
 * @returns 
 */
export function commentList(data) {
  return request({
    url: 'course/commentList',
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
export function chapterList(data) {
  return request({
    url: 'course/chapter',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程信息
 * @param {*} data {region_id: 地区id,  course_id: 课程id}
 * @returns 
 */
export function courseInfo(data) {
  return request({
    url: 'course/info',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程列表
 * @param {*} data {page: 1, page_size: 10, region_id，地区id， category_id： 分类id}
 * @returns 
 */
export function courseList(data) {
  return request({
    url: 'course/list',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程分类
 * @param {*} data 
 * @returns 
 */
export function courseCategory(data) {
  return request({
    url: 'course/category',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 评价
 * @param {*} data {course_id: 课程id, star: 频分， ccomment: 内容} 
 * @returns 
 */
export function courseComment(data) {
  return request({
    url: 'course/comment',
    method: 'post',
    data,
    loading: true
  })
}

/**
 * 课程评价详情
 * @param {*} data {course_id: 课程id}
 * @returns 
 */
export function courseGetCommentInfo(data) {
  return request({
    url: 'course/getCommentInfo',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 评论列表
 * @param {*} data {course_id: 课程id, page: 1, limit: 10}
 * @returns 
 */
export function courseGetCommentList(data) {
  return request({
    url: 'course/getCommentList',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 视频播放记录
 * @param {*} data {lesson_id：课时id，start_second: 开始秒, end_second：结束秒}
 * @returns 
 */
export function courseRecordLearn(data) {
  return request({
    url: 'course/recordLearn',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 视频播放信息
 * @param {*} data {lesson_id: 课时id}
 * @returns 
 */
export function courseGetVideoAuth(data) {
  return request({
    url: 'course/getVideoAuth',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程详情
 * @param {*} data {course_id: 课程id} 
 * @returns 
 */
export function courseGetCourseDetail(data) {
  return request({
    url: 'course/getCourseDetail',
    method: 'get',
    data,
    loading: true
  })
}

/**
 * 课程列表
 * @param {*} data 
 * @returns 
 */
export function courseGetCourseList(data) {
  return request({
    url: 'course/getCourseList',
    method: 'get',
    data,
    loading: true
  })
}



