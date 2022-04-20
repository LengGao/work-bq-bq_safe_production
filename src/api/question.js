
import requset from '@/request/miniapp'
// 获取章节列表
export const getChapterList = (data) => {
  return requset({
    url: 'practice/chapter',
    method: 'get',
    data: {
      ...data,
      question_bank_id: 12
    },
  })
}