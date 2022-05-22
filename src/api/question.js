
import requset from '@/request/index'
// 获取章节列表
export const getChapterList = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/practice/chapter',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成章节练习题目
export const createPractice = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/practice/create',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 答题卡
export const getQuestionBoard = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/Topic/questionBoard',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 提交答案
export const submitAnswer = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/Topic/submitAnswer',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 结算成绩
export const settlement = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/Topic/settlement',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 题目收藏
export const setCollection = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/UserTopicRecord/setCollection',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 模拟考试配置
export const testExamConfig = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/mockExam/testExamConfig',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成模拟考试题目
export const createMockExam = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/MockExam/create',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 历年真题配置
export const getOverYearConfig = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/RealTopic/testExamConfig',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成历年真题题目
export const createRealTopic = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/realTopic/create',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 自主出题配置
export const getIndependentConfig = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/independent/testExamConfig',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成自主出题题目
export const createIndependent = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/independent/create',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成每日打卡题目
export const createDailyClock = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/DailyClock/create',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 生成刷题挑战题目
export const createChallenge = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/Challenge/create',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 收藏夹错题集题目
export const getUserTopicRecord = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/UserTopicRecord/Topic',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 提交错题集答案
export const submitWrongQuestion = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/UserTopicRecord/submit',
    method: 'post',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 模拟考试记录列表
export const getMockExamHistory = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/MockExam/history',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 自主出题题目列表
export const getIndependentPapers = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/independent/independentPapers',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 历年真题列表
export const getRealTestPapers = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/RealTopic/realTestPapers',
    method: 'get',
    data,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}
// 收藏夹列表
export const getFavoritesList = (data) => {
  return requset({
    url: 'https://store.beiqujy.com/apidata/applet/UserTopicRecord/chapter',
    method: 'get',
    data,
    loading: true,
    header: {
      token: 'eyJvcmdhbml6YXRpb25faWQiOjM0NiwiYXV0b2dyYXBoIjoiTitqOEpEZThUWVJkb0hhYXV6WDRCQlljSlNaRmM1eU5CeTdjeGszdW5mbjdYVytZazd0SUxIdGIzYUt0NWNMRWVFaFFtdXdxRnZpUjNuK0lScXZpUmFCYitmZndUSEtYRmVTY2lCajBSc0U9IiwicHJpdmF0ZV9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4IiwidWlkIjo0NTkwMCwib3JpZ2luYWxfdXNlcl9rZXkiOiIyODQ4MTUxNTQxNTEwNzE4In0=',
    }
  })
}

// 随堂测试 题目
export function practiceStart(data) {
  return requset({
    url: 'course/practiceStart',
    method: 'get',
    data   
  })
}
// 随堂测试 提交答案  
export function practiceAnswer(data) {
  return requset({
    url: 'course/practiceAnswer',
    method: 'POST',
    data   
  })
}
// 随堂测试 答题解析
export function practiceAnalyse(data) {
  return requset({
    url: 'course/practiceAnalyse',
    method: 'get',
    data   
  })
}