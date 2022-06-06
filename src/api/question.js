import requset from '@/request/index'



export function practiceStart(data) {
  return requset({
    url: 'course/practiceStart',
    method: 'get',
    data   
  })
}

export function practiceAnswer(data) {
  return requset({
    url: 'course/practiceAnswer',
    method: 'POST',
    data
  })
}

export function practiceSubmit(data) {
  return requset({
    url: 'course/practiceSubmit',
    method: 'POST',
    data
  })
}

export function practiceAnalyse(data) {
  return requset({
    url: 'course/practiceAnalyse',
    method: 'get',
    data   
  })
}

export function getQuestionBankList(data) {
  return requset({
    url: 'question/getQuestionBankList',
    method: 'get',
    data   
  })
}

export function getChapterList(data) {
  return requset({
    url: 'question/getPracticeChapterList',
    method: 'post',
    data   
  })
}

export function restartPractice(data) {
  return requset({
    url: 'question/restartPractice',
    method: 'post',
    data   
  })
}

export function getPracticeAnswerSheet(data) {
  return requset({
    url: 'question/getPracticeAnswerSheet',
    method: 'post',
    data,
  })
}

export function getQuestionDetail(data) {
  return requset({
    url: 'question/getQuestionDetail',
    method: 'post',
    data,
    nocatch: true
  })
}

export function customExamList(data) {
  return requset({
    url: 'question/customExamList',
    method: 'post',
    data   
  })
}

export function getCustomExamInfo(data) {
  return requset({
    url: 'question/getCustomExamInfo',
    method: 'post',
    data   
  })
}

export function getMockExamInfo(data) {
  return requset({
    url: 'question/getMockExamInfo',
    method: 'post',
    data   
  })
}

export function wrongChapterList(data) {
  return requset({
    url: 'question/wrongChapterList',
    method: 'post',
    data   
  })
}

export function wrongAnswerSheet(data) {
  return requset({
    url: 'question/wrongAnswerSheet',
    method: 'post',
    data   
  })
}

export function collectChapterList(data) {
  return requset({
    url: 'question/collectChapterList',
    method: 'post',
    data   
  })
}

export function collectAnswerSheet(data) {
  return requset({
    url: 'question/collectAnswerSheet',
    method: 'post',
    data   
  })
}

export function mockExamList(data) {
  return requset({
    url: 'question/mockExamList',
    method: 'post',
    data   
  })
}

export function practiceAnswerTheQuestion(data) {
  return requset({
    url: 'question/practiceAnswerTheQuestion',
    method: 'post',
    data   
  })
}

export function examAnswerTheQuestion(data) {
  return requset({
    url: 'question/examAnswerTheQuestion',
    method: 'post',
    data
  })
}

export function submitExamPaper(data) {
  return requset({
    url: 'question/submitExamPaper',
    method: 'post',
    data
  })
}


export function collect(data) {
  return requset({
    url: 'question/collect',
    method: 'post',
    data   
  })
}

export function getMockExamLog(data) {
  return requset({
    url: 'question/getMockExamLog',
    method: 'post',
    data   
  })
}

export function createExamLog(data) {
  return requset({
    url: 'question/createExamLog',
    method: 'post',
    data   
  })
}

export function getExamAnswerSheet(data) {
  return requset({
    url: 'question/getExamAnswerSheet',
    method: 'post',
    data   
  })
}

export function getExamResult(data) {
  return requset({
    url: 'question/getExamResult',
    method: 'post',
    data   
  })
}

export function getDailyStatistics(data) {
  return requset({
    url: 'question/getDailyStatistics',
    method: 'post',
    data   
  })
}

export function getStudyReport(data) {
  return requset({
    url: 'question/getStudyReport',
    method: 'post',
    data   
  })
}
