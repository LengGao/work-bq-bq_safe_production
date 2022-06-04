<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex" :disable-touch="false"
            @animationfinish="onAnimationfinish">

      <swiper-item class="swiper-item"
                   :class="{ 'swiper-item--hidden': questionList[currentIndex] && questionList[currentIndex].question_type === 7 }"
                   v-for="(item, index) in answerSheetArr" :key="index">
        <Single :options="questionList[index]" :model="model" @change="onSingleChange"
                v-if="questionList[index] && questionList[index].question_type === 1" />
        <Multiple :options="questionList[index]" :model="model" @change="onSingleChange"
                  v-if="questionList[index] && questionList[index].question_type === 2" />
        <Indefinite :options="questionList[index]" :model="model" @change="onSingleChange"
                    v-if="questionList[index] && questionList[index].question_type === 3" />
        <Judg :options="questionList[index]" :model="model" @change="onSingleChange"
              v-if="questionList[index] && questionList[index].question_type === 4" />
        <Completion :options="questionList[index]" :model="model" @change="onInputChange"
                    v-if="questionList[index] && questionList[index].question_type === 5" />
        <Short :options="questionList[index]" :model="model" @change="onInputChange"
               v-if="questionList[index] && questionList[index].question_type === 6" />
        <Case :options="questionList[index]" :serial-number="currentIndex + 1" :model="model"
              v-if="questionList[index] && questionList[index].question_type === 7" 
              :ref="`case-${item.id}`" :question-bank="question_bank_id" :log-id="exam_log_id" 
              @change="onCaseChange" @submitanswe-case="submitAnswerChild" @index-change="onCaseIndexChange" />
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" v-if="questionList[currentIndex]" ref="answerbar" :is-end="isEnd" :is-start="isStart"
               :time="time" :model="model" :isCollection="questionList[currentIndex].is_collect" @card="toCard"
               @submit-paper="submitPaper" @end-practice="endPractice" 
               @collect="setCollection" @timeup="onTimeUp" @prev="handlePrev"
               @next="handleNext">
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
  getQuestionDetail,
  wrongAnswerSheet,
  collectAnswerSheet,
  getPracticeAnswerSheet,
  getExamAnswerSheet,
  practiceAnswerTheQuestion,
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
      duration: 300,

      total: 0,
      questionList: [],
      answerSheetArr: [],
      answer: {},
      userAnswerMap: {},
      caseIndex: 0,
      userAnswerMapCase: [],

      tiem: 0,
      title: '',
      source: '',

      chapter_id: 0,
      question_id: 0,
      last_question_id: 0,
      exam_log_id: 0,
      question_bank_id: 0,

      model: 1,
      sourceMap: {
        'wrong': 1,
        'favorites': 1,
        'chapter': 1,
        'examRandom': 2,
        'examAutonomy': 2,
        'examRecord': 3,
        "memoryWrong": 3,
        "memoryFavorites": 3,
      },
      answerSheetApiMap: {},
      answerApiMap: {},
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
    this.init(query)
    this.injectApi()
    this.getPracticeAnswerSheet()
  },
  methods: {
    init(query) {
      let {
        chapter_id,
        exam_log_id,
        last_question_id,
        question_bank_id,
        title = "",
        model = 0,
        source = "",
      } = query
      if (!source) uni.showToast({ title: '无效答题来源' })

      this.chapter_id = +chapter_id
      this.exam_log_id = +exam_log_id
      this.last_question_id = +last_question_id
      this.question_bank_id = +question_bank_id
      this.title = title
      this.source = source
      this.model = !!model ? +model : this.sourceMap[source]

      uni.setNavigationBarTitle({ title })
    },

    injectApi() {
      this.answerSheetApiMap = {
        "wrong": wrongAnswerSheet,
        "favorites": collectAnswerSheet,
        "chapter": getPracticeAnswerSheet,
        "examRandom": getExamAnswerSheet,
        "examAutonomy": getExamAnswerSheet,
        "examRecord": getExamAnswerSheet,
        "memoryWrong": wrongAnswerSheet,
        "memoryFavorites": collectAnswerSheet,
      }
      this.answerApiMap = {
        "wrong": practiceAnswerTheQuestion,
        "favorites": practiceAnswerTheQuestion,
        "chapter": practiceAnswerTheQuestion,
        "examRandom": examAnswerTheQuestion,
        "examAutonomy": examAnswerTheQuestion,
        "examRecord": examAnswerTheQuestion,
        "memoryWrong": wrongAnswerSheet,
        "memoryFavorites": collectAnswerSheet,
      }
    },

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
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) { this.cacheAnswer(answer) }
    },

    onInputChange(answer) {
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) { this.cacheAnswer(answer) }
      // console.log(answer);
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

    onSwiperChange({ detail }) {
      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }
      if (this.isStart) {
        uni.showToast({ title: '已经是第一题了', icon: 'none' })
      } else if (this.isEnd) {
        uni.showToast({ title: '已经是最后一题了', icon: 'none' })
      }

      this.prevfetch()
      this.submitAnswer(this.prevIndex)
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

    onAnimationfinish({ detail }) {
    },

    onCaseIndexChange(index) {
    },

    onCaseChange(caseIndex, answer) {
      this.caseIndex = caseIndex
      this.userAnswerMapCase[caseIndex] = answer
      // console.log('onCaseChange', this.userAnswerMapCase);
    },

    getCurrAnswer(index) {
      let key = this.questionList[index].id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      let key = answer.id
      this.userAnswerMap[key] = answer
      if (this.isEnd) {
        this.submitAnswer()
      }
    },

    getPath(url, query) {
      let params = ''
      Object.keys(query).forEach((key) => { params += `&${key}=${query[key]}` })
      
      params = params.replace(/&?/, '?')
      return url + params
    },

    getQuery(prevIndex) {
      let index = prevIndex !== undefined ? prevIndex : this.currentIndex
      let quetion = this.questionList[index]
      let title = this.title
      let chapter_id = this.chapter_id
      let question_bank_id = this.question_bank_id
      let exam_log_id = this.exam_log_id
      let type = quetion.question_type
      let question_id = quetion.id
      let answer = this.userAnswerMap[question_id]
      let answerCase = this.userAnswerMapCase[this.caseIndex]
      let model = this.model
      let source = this.source

      return { title, chapter_id, question_id, question_bank_id, exam_log_id, type, model, source, answer, answerCase }
    },

    getParams() {
    },

    onTimeUp() {
      uni.showModal({
        title: '提示',
        content: '考试时间到，系统自动交卷',
        showCancel: false,
        success: ({ confirm }) => {
          if (confirm) { this.submitPaper() }
        }
      })
    },

    async toCard() {
      let url = '/pages/examinations/answerSheet/index'
      let { title, chapter_id, question_id, question_bank_id, exam_log_id, type, model, source, answer, answerCase } = this.getQuery()
      let query = { chapter_id, question_id, question_bank_id, exam_log_id, title, model, source }
      let path = this.getPath(url, query)
      let api = this.answerApiMap[source]
      let params = {}, res
      // console.log('path', path);
      if (type === 7 && answerCase) {
        params = { exam_log_id, question_bank_id, question_id: answerCase.id, user_answer: answerCase.answer }
        res = await api(params)
        if (res.code === 0) { uni.redirectTo({ url: path }) }
      } else if (answer) {
        params = { exam_log_id, question_bank_id, question_id: answer.id, user_answer: answer.answer }
        res = await api(params)
        if (res.code === 0) { uni.redirectTo({ url: path }) }
      } else {
        uni.redirectTo({ url: path })
      }
    },

    async setCollection() {
      let { question_id, question_bank_id } = this.getQuery()
      let params = { question_id, question_bank_id }
      let res = await collect(params)
      if (res.code === 0) {
        if (res.message.indexOf('取消') !== -1) {
          this.questionList[this.currentIndex].is_collect = 0
        } else {
          this.questionList[this.currentIndex].is_collect = 1
        }
        uni.showToast({ title: `${res.message}`, icon: 'none' })
        this.$forceUpdate()
      }
    },


    async endPractice() {
      let url = '/pages/examinations/answerSheet/index'
      let { title, chapter_id, question_id, question_bank_id, exam_log_id, type, model, source, answer, answerCase } = this.getQuery()
      let query = { chapter_id, question_id, question_bank_id, exam_log_id, title, model, source }
      let path = this.getPath(url, query)
      let api = this.answerApiMap[source]
      let params = {}, res
      // console.log('path', path);
      if (type === 7 && answerCase) {
        params = { chapter_id, question_bank_id, question_id: answerCase.id, user_answer: answerCase.answer }
        res = await api(params)
        if (res.code === 0) { uni.redirectTo({ url: path }) }
      } else if (answer) {
        params = { chapter_id, question_bank_id, question_id: answer.id, user_answer: answer.answer }
        res = await api(params)
        if (res.code === 0) { uni.redirectTo({ url: path }) }
      } else {
        uni.redirectTo({ url: path })
      }
    },


    async submitPaper() {
      let url = `/pages/examinations/answerResult/index`
      let { title, chapter_id, question_id, question_bank_id, exam_log_id, type, model, source, answer, answerCase } = this.getQuery()
      let query = { chapter_id, question_id, question_bank_id, exam_log_id, title, model, source }
      let path = this.getPath(url, query)
      let api = this.answerApiMap[source]
      let params = {}, res, ret

      if (type === 7 && answerCase) {
        params = { exam_log_id, question_bank_id, question_id: answerCase.id, user_answer: answerCase.answer }
        res = await api(params)
      } else if (answer) {
        params = { exam_log_id, question_bank_id, question_id: answer.id, user_answer: answer.answer }
        res = await api(params)
      }
      let params2 = { exam_log_id, question_bank_id }
      ret = await submitExamPaper(params2)
      if (ret.code === 0) {
        uni.showToast({ title: '提交陈功', icon: 'success' }).then(succ => {
          uni.redirectTo({ url: path })
        })
      }
    },

    async submitAnswerChild() {
      let { exam_log_id, question_bank_id, source, answerCase } = this.getQuery()
      // console.log('submitAnswerChild', answerCase);
      let api = this.answerApiMap[source]
      if (answerCase) { 
        let params = { exam_log_id, question_bank_id, question_id: answerCase.id, user_answer: answerCase.answer }
        return api(params)
      }
    },

    async submitAnswer(prevIndex) {
      let { exam_log_id, question_bank_id, source, answer } = this.getQuery(prevIndex)
      
      let api = this.answerApiMap[source]
      if (answer) {
        let params = { exam_log_id, question_bank_id, question_id: answer.id, user_answer: answer.answer }
        return api(params)
      }
    },

    async getQuestionDetail(question_id, index) {
      let params = { question_id, question_bank_id: this.question_bank_id }
      let source = this.source

      if (source === 'wrong') {
        params.type = 1
      } else if (source === 'examRandom' || source === 'examAutonomy') {
        params.exam_log_id = this.exam_log_id
      }
      
      if (question_id) {
        let res = await getQuestionDetail(params)
        if (res.code === 0) { this.questionList[index] = res.data }
      }
    },

    async getPracticeAnswerSheet() {
      let source = this.source
      let chapter_id = this.chapter_id
      let exam_log_id = this.exam_log_id
      let last_question_id = this.last_question_id
      let question_bank_id = this.question_bank_id
      let api = this.answerSheetApiMap[source]

      let params = { chapter_id, exam_log_id, question_bank_id }
      let res = await api(params)
      if (res.code === 0) {
        let lastId = last_question_id ? last_question_id : res.data.last_question_id
        let arr = res.data.arr
        let total = arr.length
        let prev = 0
        let curr = 0
        let next = 0

        if (!lastId) lastId = arr[0].id;
        let index = arr.findIndex(item => item.id === lastId)

        if (index > 0 && index < total - 1) {
          prev = arr[index - 1].id
          curr = arr[index].id
          next = arr[index + 1].id
        } else if (index === total - 1 && total > 3) {
          prev = arr[index - 2].id
          curr = arr[index - 1].id
          next = arr[index].id
        } else {
          prev = arr[0].id
          curr = arr[1].id
          next = arr[2].id
        }

        this.last_question_id = lastId
        this.answerSheetArr = arr
        this.total = total
        this.currentIndex = (index !== -1 ? index : 0)
        this.time = res.data.expires_time || 0
        this.initQuestion(prev, curr, next)
      }
    },

    async initQuestion(prev, curr, next) {
      let exam_log_id = this.exam_log_id
      let question_bank_id = this.question_bank_id

      let params1 = { question_bank_id, exam_log_id, question_id: prev }
      let params2 = { question_bank_id, exam_log_id, question_id: curr }
      let params3 = { question_bank_id, exam_log_id, question_id: next }
      let res = await Promise.all([getQuestionDetail(params1), getQuestionDetail(params2), getQuestionDetail(params3)])
      if (res.length) {
        let list = res.map(item => item.data)
        this.fiilQuestion(list)
      }
    },

    fiilQuestion(list) {
      let total = this.total, index = this.currentIndex, arr = [].fill('', 0, total)
      if (index > 0 && index < total - 1) {
        arr[index - 1] = list[0]
        arr[index] = list[1]
        arr[index + 1] = list[2]

      } else if (index === total - 1 && total > 3) {
        arr[index - 2] = list[0]
        arr[index - 1] = list[1]
        arr[index] = list[2]
      } else {
        arr[index] = list[0]
        arr[index + 1] = list[1]
        arr[index + 2] = list[2]
      }

      this.questionList = JSON.parse(JSON.stringify(arr))
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