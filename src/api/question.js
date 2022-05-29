
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
    data   
  })
}

export function getQuestionDetail(data) {
  return requset({
    url: 'question/getQuestionDetail',
    method: 'post',
    data   
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

export function wrongChapterList(data) {
  return requset({
    url: 'question/wrongChapterList',
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
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }
// export function practiceAnalyse(data) {
//   return requset({
//     url: 'course/practiceAnalyse',
//     method: 'get',
//     data   
//   })
// }






