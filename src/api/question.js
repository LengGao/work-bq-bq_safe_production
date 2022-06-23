import request from '@/request/index'


export function getQuestionBankList(data) {
  return request({
    url: 'question/getQuestionBankList',
    method: 'get',
    data   
  })
}

export function getChapterList(data) {
  return request({
    url: 'question/getPracticeChapterList',
    method: 'post',
    data,
    loading: false
  })
}

export function restartPractice(data) {
  return request({
    url: 'question/restartPractice',
    method: 'post',
    data   
  })
}

export function getPracticeAnswerSheet(data) {
  return request({
    url: 'question/getPracticeAnswerSheet',
    method: 'post',
    data,
  })
}

export function getQuestionDetail(data) {
  return request({
    url: 'question/getQuestionDetail',
    method: 'post',
    data,
    nocatch: true
  })
}

export function customExamList(data) {
  return request({
    url: 'question/customExamList',
    method: 'post',
    data   
  })
}

export function getCustomExamInfo(data) {
  return request({
    url: 'question/getCustomExamInfo',
    method: 'post',
    data   
  })
}

export function getMockExamInfo(data) {
  return request({
    url: 'question/getMockExamInfo',
    method: 'post',
    data   
  })
}

export function wrongChapterList(data) {
  return request({
    url: 'question/wrongChapterList',
    method: 'post',
    data   
  })
}

export function wrongAnswerSheet(data) {
  return request({
    url: 'question/wrongAnswerSheet',
    method: 'post',
    data   
  })
}

export function collectChapterList(data) {
  return request({
    url: 'question/collectChapterList',
    method: 'post',
    data   
  })
}

export function collectAnswerSheet(data) {
  return request({
    url: 'question/collectAnswerSheet',
    method: 'post',
    data   
  })
}

export function mockExamList(data) {
  return request({
    url: 'question/mockExamList',
    method: 'post',
    data   
  })
}

export function practiceAnswerTheQuestion(data) {
  return request({
    url: 'question/practiceAnswerTheQuestion',
    method: 'post',
    data   
  })
}

export function examAnswerTheQuestion(data) {
  return request({
    url: 'question/examAnswerTheQuestion',
    method: 'post',
    data
  })
}

export function submitExamPaper(data) {
  return request({
    url: 'question/submitExamPaper',
    method: 'post',
    data
  })
}


export function collect(data) {
  return request({
    url: 'question/collect',
    method: 'post',
    data   
  })
}

export function getMockExamLog(data) {
  return request({
    url: 'question/getMockExamLog',
    method: 'post',
    data   
  })
}

export function createExamLog(data) {
  return request({
    url: 'question/createExamLog',
    method: 'post',
    data   
  })
}

export function getExamAnswerSheet(data) {
  return request({
    url: 'question/getExamAnswerSheet',
    method: 'post',
    data   
  })
}

export function getExamResult(data) {
  return request({
    url: 'question/getExamResult',
    method: 'post',
    data   
  })
}

export function getDailyStatistics(data) {
  return request({
    url: 'question/getDailyStatistics',
    method: 'post',
    data,
    nocatch: true
  })
}

export function getStudyReport(data) {
  return request({
    url: 'question/getStudyReport',
    method: 'post',
    data   
  })
}
