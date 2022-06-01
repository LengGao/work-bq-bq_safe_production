<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex" :disable-touch="false"
            @animationfinish="onAnimationfinish">

      <swiper-item class="swiper-item"
                   :class="{ 'swiper-item--hidden': questionList[currentIndex] && questionList[currentIndex].question_type === 7 }"
                   v-for="(item, index) in answerSheetArr" :key="index">
        <Single :options="questionList[index]" :isAnalysis="isAnalysis" @change="onSingleChange"
                v-if="questionList[index] && questionList[index].question_type === 1" />
        <Multiple :options="questionList[index]" :isAnalysis="isAnalysis" @change="onSingleChange"
                  v-if="questionList[index] && questionList[index].question_type === 2" />
        <Indefinite :options="questionList[index]" :isAnalysis="isAnalysis" @change="onSingleChange"
                    v-if="questionList[index] && questionList[index].question_type === 3" />
        <Judg :options="questionList[index]" :isAnalysis="isAnalysis" @change="onSingleChange"
              v-if="questionList[index] && questionList[index].question_type === 4" />
        <Completion :options="questionList[index]" :isAnalysis="isAnalysis" @change="onInputChange"
                    v-if="questionList[index] && questionList[index].question_type === 5" />
        <Short :options="questionList[index]" :isAnalysis="isAnalysis" @change="onInputChange"
               v-if="questionList[index] && questionList[index].question_type === 6" />
        <Case :options="questionList[index]" :isAnalysis="isAnalysis" :serial-number="currentIndex + 1" 
              :log-id="exam_log_id" :is-active="currentIndex === index" :ref="`case-${item.id}`"
              v-if="questionList[index] && questionList[index].question_type === 7"
              @change="onCaseChange" @index-change="onCaseIndexChange" />
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" v-if="questionList[currentIndex]" ref="answerbar"
               :is-end="isEnd" :is-start="isStart" :time="time" :model="model"
               :isCollection="questionList[currentIndex].is_collect"
               @timeup="onTimeUp" @card="toCard" @submit-paper="submitPaper"
               @next="handleNext" @prev="handlePrev" @collect="setCollection">
    </AnswerBar>
  </view>
</template>

<script>
import AnswerBar from "../components/answerBar";
import AnswerHead from "../components/answerHead";
import Single from "../components/single";
import Multiple from "../components/multiple";
import Judg from "../components/judg";
import Indefinite from "../components/indefinite";
import Completion from "../components/completion";
import Short from "../components/short";
import Case from "../components/case";

import {
  getExamAnswerSheet,
  getQuestionDetail,
  examAnswerTheQuestion,
  submitExamPaper,
  collect,
} from "@/api/question";

export default {
  name: "answer",
  components: {
    AnswerHead,
    AnswerBar,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    Case,
  },

  data() {
    return {
      prevIndex: -1,
      currentIndex: 0,
      nextIndex: 1,
      duration: 300,

      chapter_id: 0,
      last_question_id: 0,
      question_bank_id: 0,
      exam_log_id: 0,      
      tiem: 0,
      model: '2',

      answer: {},
      questionList: [],
      total: 0,
      answerSheetArr: [],
      userAnswerMap: {},
      
      title: '',
      isReview: false,
      isAnalysis: false
    };
  },
  computed: {
    isEnd() {
      return this.currentIndex >= this.total - 1
    },
    isStart() {
      return this.currentIndex <= 0
    },
    isRight() {
      return this.currentIndex > this.prevIndex
    },
  },
  onLoad(query) {
    let { 
      exam_log_id,
      chapterId, 
      question_bank_id, 
      question_id, 
      title = "模拟考试",
      isReview = false,
      isAnalysis
    } = query
    this.isReview = !!isReview
    this.chapter_id = +chapterId
    this.question_bank_id = +question_bank_id
    this.question_id = +question_id
    this.exam_log_id = +exam_log_id
    this.isAnalysis = !!isAnalysis

    uni.setNavigationBarTitle({ title })
    this.getPracticeAnswerSheet()
  },
  methods: {
    checkInputAnswer(answer) {
      let res = false
      if (Array.isArray(answer)) {
        res = answer.some(val => val !== undefined && val !== '' && val !== null)
      } else if (answer !== undefined && answer !== '' && answer !== null) {
        res = true
      }
      return res
    },

    onSingleChange(answer) {
      let flag = false
      flag = this.checkInputAnswer(answer.answer)
      if (flag) {
        this.cacheAnswer(answer)
      }
    },

    onInputChange(answer) {
      let flag = false
      flag = this.checkInputAnswer(answer.answer)
      if (flag) {
        this.cacheAnswer(answer)
      }
    },

    handlePrev() {
      if (!this.isStart) {
        this.prevIndex = this.currentIndex
        this.currentIndex = this.currentIndex - 1
      }
    },

    handleNext() {
      if (!this.isEnd) {
        this.prevIndex = this.currentIndex
        this.currentIndex = this.currentIndex + 1
      }
    },

    prevfetch() {
      let index = 0
      if (this.isRight) {
        index = this.currentIndex + 1
      } else {
        index = this.currentIndex - 1
      }
      if (index > this.total - 1 || index < 0) return;

      let inAnswerSheet = this.answerSheetArr[index]
      let inQuestionList = this.questionList[index]

      if (inAnswerSheet && !inQuestionList) {
        let question_id = inAnswerSheet.id
        this.getQuestionDetail(question_id, index)
      }
    },

    onSwiperChange({ detail }) {
      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }
      if (detail.current <= 0) {
        uni.showToast({ title: '已经是第一题了', icon: 'none' })
      } else if (detail.current >= this.total - 1) {
        uni.showToast({ title: '已经是最后一题了', icon: 'none' })
      }
      this.prevfetch()
      this.submitAnswer()
    },

    onAnimationfinish({ detail }) {
    },

    onCaseIndexChange(index) {
    },

    onCaseChange(index, answer) {
    },

    getCurrAnswer(index) {
      // console.log(index, this.questionList);
      let key = this.questionList[index].id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      let key = answer.id
      this.userAnswerMap[key] = answer
      console.log('cacheAnswer', answer, this.userAnswerMap);
    },

    onTimeUp() {
      uni.showModal({
        title: '提示',
        content: '考试时间到，系统自动交卷',
        showCancel: false,
        success: ({ confirm }) => {
          if (confirm) { 
            this.submitPaper()
          }
        }
      })
    },

    async toCard() {
      let index = this.currentIndex
      let quetion = this.questionList[index]
      let question_bank_id = this.question_bank_id
      let exam_log_id = this.exam_log_id
      let type = quetion.question_type
      let question_id = quetion.id
      let title = this.title
      let answer = this.getCurrAnswer(index)

      let url = '/pages/examinations/examinationMode/answerSheet/index'
      let query = `?exam_log_id=${exam_log_id}&question_bank_id=${question_bank_id}&question_id=${question_id}&title=${title}`
      
      let params = {}, res, ret

      if (type === 7) {
        params = {question_bank_id, exam_log_id}
        res = await this.submitAnswer(params)
        if (res.code === 0) {
          uni.showToast({ title: '提交陈功', icon: 'success' }).then(succ => {
            uni.redirectTo({ url: url + query })
          })
        }
      } else if (answer) {
        params = { question_bank_id, exam_log_id, question_id, user_answer: answer.answer }
        res = await examAnswerTheQuestion(params)
        if (res.code === 0) {
          params = {question_bank_id, exam_log_id}
          ret = await this.submitAnswer(params)
          if (ret.code === 0) {
            uni.showToast({ title: '提交陈功', icon: 'success' }).then(succ => {
              uni.redirectTo({ url: url + query })
            })
          }
        }
      } else {
        uni.redirectTo({ url: url + query})
      }
    },

    async setCollection() {
      let index = this.currentIndex
      let question_id = this.questionList[index].id
      let question_bank_id = this.question_bank_id

      let data = {question_bank_id: question_bank_id, question_id}
      let res = await collect(data)
      if (res.code === 0) {
        if (res.message.indexOf('取消') !== -1) {
          this.questionList[index].is_collect = 0
        } else {
          this.questionList[index].is_collect = 1
        }
        uni.showToast({ title: `${res.message}`, icon: 'none'})
        this.$forceUpdate()
      }
    },

    async submitPaper() {
      let index = this.currentIndex
      let quetion = this.questionList[index]
      let question_bank_id = this.question_bank_id
      let exam_log_id = this.exam_log_id
      let type = quetion.question_type
      let question_id = quetion.id
      let answer = this.getCurrAnswer(index)
      
      let params = {}, res, ret

      if (type === 7) {
        params = {question_bank_id, exam_log_id}
        res = await submitExamPaper(params)
        if (res.code === 0) {
          uni.showToast({ title: '提交陈功', icon: 'success' }).then(succ => {
            uni.redirectTo({ url: '/pages/examinations/examinationMode/result/index' })
          })
        }
      } else if (answer) {
        params = { question_bank_id, exam_log_id, question_id, user_answer: answer.answer }
        res = await examAnswerTheQuestion(params)
        if (res.code === 0) {
          params = {question_bank_id, exam_log_id}
          ret = await submitExamPaper(params)
          if (ret.code === 0) {
            uni.showToast({ title: '提交陈功', icon: 'success' }).then(succ => {
              uni.redirectTo({ url: '/pages/examinations/examinationMode/result/index' })
            })
          }
        }
      }
    },

    async submitAnswer(params) {
      let answer
      if (params) {
        answer = this.getCurrAnswer(this.currentIndex)
      } else {
        answer = this.getCurrAnswer(this.prevIndex)
      }

      if (answer) {
        let question_bank_id = this.question_bank_id
        let data = { question_bank_id: question_bank_id, exam_log_id: this.exam_log_id, question_id: answer.id, user_answer: answer.answer }
        examAnswerTheQuestion(data);
      }
    },

    async getQuestionDetail(question_id, index) {
      // console.log(index, this.currentIndex);
      let question_bank_id = this.question_bank_id
      let params = { question_id: question_id, question_bank_id: question_bank_id }
      let res = await getQuestionDetail(params)
      if (res.code === 0) {
        this.questionList[index] = res.data
      }
    },

    async getPracticeAnswerSheet() {
      let params = { question_bank_id: this.question_bank_id, exam_log_id: this.exam_log_id }
      let res = await getExamAnswerSheet(params)
      if (res.code === 0) {
        let lastId = res.data.last_question_id
        let arr = res.data.arr
        let total = arr.length
        let prev = 0
        let curr = 0
        let next = 0
        if (!lastId) lastId = arr[0].id;
        if (this.isReview) lastId = this.question_id;

        let index = arr.findIndex(item => item.id === lastId)
        // console.log("index", index);
        
        if (index === -1) {
          prev = arr[0].id
          curr = arr[1].id
          next = arr[2].id
        } else if (index === 0) {
          prev = arr[index].id
          curr = arr[index + 1].id
          next = arr[index + 2].id
        } else if (index === total - 1) {
          prev = arr[index - 2].id
          curr = arr[index - 1].id
          next = arr[index].id
        } else {
          prev = arr[index - 1].id
          curr = arr[index].id
          next = arr[index + 1].id
        }

        this.last_question_id = lastId
        this.question_id = lastId
        this.answerSheetArr = arr
        this.total = total
        this.time = res.data.expires_time
        this.currentIndex = (index !== -1 ? index : 0)
        this.initQuestion(prev, curr, next)
      }
    },

    async initQuestion(prev, curr, next) {
      let question_bank_id = this.question_bank_id
      let params1 = { question_bank_id: question_bank_id, question_id: prev }
      let params2 = { question_bank_id: question_bank_id, question_id: curr }
      let params3 = { question_bank_id: question_bank_id, question_id: next }
      let res = await Promise.all([getQuestionDetail(params1), getQuestionDetail(params2), getQuestionDetail(params3)])
      if (res.length) {
        let list = res.map(item => item.data)
        this.fiilQuestion(list)
      }
    },

    fiilQuestion(list) {
      let arr = [].fill('', 0, this.answerSheetArr.length), index = this.currentIndex
      if (index <= 0) {
        arr[index] = list[0]
        arr[index + 1] = list[1]
        arr[index + 2] = list[2]
      } else if (index >= this.total - 1) {
        arr[index - 2] = list[0]
        arr[index - 1] = list[1]
        arr[index] = list[2]
      } else {
        arr[index - 1] = list[0]
        arr[index] = list[1]
        arr[index + 1] = list[2]
      }

      this.questionList = JSON.parse(JSON.stringify(arr))
      // console.log('this.questionList', this.questionList);
    },

  }
}
</script>

<style lang="scss" scoped>
.answer {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .swiper {
    flex: 1;
    &-item {
      position: relative;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 20rpx 40rpx;
      &--hidden {
        overflow: hidden;
        padding: 0;
      }
    }
  }

  .bar {
    margin-top: auto;
  }
}
</style>