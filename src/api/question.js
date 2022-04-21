
import requset from '@/request/index'
// 获取章节列表
export const getChapterList = (data) => {
  return requset({
    url: 'QuestionBank/Lists',
    method: 'get',
    data: {
      ...data,
      question_bank_id: 12
    },
  })
}