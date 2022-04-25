
import requset from '@/request/index'
// 获取章节列表
export const getChapterList = (data) => {
  return requset({
    url: 'practice/chapter',
    method: 'get',
    data,
  })
}
// 生成章节练习题目
export const createPractice = (data) => {
  return requset({
    url: 'practice/create',
    method: 'get',
    data,
  })
}
// 答题卡
export const getQuestionBoard = (data) => {
  return requset({
    url: 'Topic/questionBoard',
    method: 'get',
    data,
  })
}
// 提交答案
export const submitAnswer = (data) => {
  return requset({
    url: 'Topic/submitAnswer',
    method: 'post',
    data,
    loading: false
  })
}
// 结算成绩
export const settlement = (data) => {
  return requset({
    url: 'Topic/settlement',
    method: 'post',
    data,
  })
}
// 题目收藏
export const setCollection = (data) => {
  return requset({
    url: 'UserTopicRecord/setCollection',
    method: 'post',
    data,
  })
}
// 模拟考试配置
export const testExamConfig = (data) => {
  return requset({
    url: 'mockExam/testExamConfig',
    method: 'post',
    data,
  })
}
// 生成模拟考试题目
export const createMockExam = (data) => {
  return requset({
    url: 'MockExam/create',
    method: 'post',
    data,
  })
}
// 历年真题配置
export const getOverYearConfig = (data) => {
  return requset({
    url: 'RealTopic/testExamConfig',
    method: 'get',
    data,
  })
}
// 生成历年真题题目
export const createRealTopic = (data) => {
  return requset({
    url: 'realTopic/create',
    method: 'post',
    data,
  })
}
// 自主出题配置
export const getIndependentConfig = (data) => {
  return requset({
    url: 'independent/testExamConfig',
    method: 'get',
    data,
  })
}
// 生成自主出题题目
export const createIndependent = (data) => {
  return requset({
    url: 'independent/create',
    method: 'post',
    data,
  })
}
// 生成每日打卡题目
export const createDailyClock = (data) => {
  return requset({
    url: 'DailyClock/create',
    method: 'post',
    data,
  })
}
// 生成刷题挑战题目
export const createChallenge = (data) => {
  return requset({
    url: 'Challenge/create',
    method: 'post',
    data,
  })
}
// 收藏夹错题集题目
export const getUserTopicRecord = (data) => {
  return requset({
    url: 'UserTopicRecord/Topic',
    method: 'post',
    data,
  })
}
// 提交错题集答案
export const submitWrongQuestion = (data) => {
  return requset({
    url: 'UserTopicRecord/submit',
    method: 'post',
    data,
  })
}
// 模拟考试记录列表
export const getMockExamHistory = (data) => {
  return requset({
    url: 'MockExam/history',
    method: 'get',
    data,
  })
}
// 自主出题题目列表
export const getIndependentPapers = (data) => {
  return requset({
    url: 'independent/independentPapers',
    method: 'get',
    data,
  })
}
// 历年真题列表
export const getRealTestPapers = (data) => {
  return requset({
    url: 'RealTopic/realTestPapers',
    method: 'get',
    data,
  })
}
// 收藏夹列表
export const getFavoritesList = (data) => {
  return requset({
    url: 'UserTopicRecord/chapter',
    method: 'get',
    data,
    loading: true
  })
}