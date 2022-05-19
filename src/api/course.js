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
// <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.9.3/skins/default/aliplayer-min.css" />
// <script charset="utf-8" src="https://g.alicdn.com/de/prismplayer/2.9.3/aliplayer-min.js" async></script> 
// aliplayerCss.href = 'https://g.alicdn.com/de/prismplayer/2.8.2/skins/default/aliplayer-min.css'
// aliplayer.src = 'https://g.alicdn.com/de/prismplayer/2.8.2/aliplayer-min.js'
{/* <link rel="stylesheet" href="https://g.alicdn.com/de/prismplayer/2.9.20/skins/default/aliplayer-min.css" />  //（可选）如果您的使用场景需要用到H5模式的播放器，则需引用此css文件。
<script charset="utf-8" type="text/javascript" src="https://g.alicdn.com/de/prismplayer/2.9.20/aliplayer-min.js"></script>  //（必须）引入js文件。 */}

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
 * @param {*} data {course_id: 课程id}
 * @returns 
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

/**
 * 视频凭证
 * @param {*} data  { lesson_id: 课时}
 * @returns 
 */
export function courseGetVideoAuth(data) {
  return request({
    url: 'course/getVideoAuth',
    method: 'get',
    data
  })
}

/**
 * 视频播放记录
 * @param {*} data {lesson_id：课时id，start_second: 开始秒, end_second：结束秒}
 * @returns 
 */
export function courseRecordLearn(data) {
  return request({
    url: 'course/learn',
    method: 'post',
    data,
    loading: false,
    nocatch: true
  })
}

/**
 * 课程收藏
 * @param {*} data 
 * @returns 
 */
export function courseFavorites(data) {
  return request({
    url: 'course/favorites',
    method: 'post',
    data,
    loading: false
  })
}

