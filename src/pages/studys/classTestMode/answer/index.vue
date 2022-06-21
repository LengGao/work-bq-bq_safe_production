<template>
  <view class="answer">
    <custom-header :title="defaultTitle" :customBack="onCustomBack"></custom-header>

    <uni-notice-bar class="notice"  v-if="notice" showIcon :text="noticeText"  />

    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" :current="currentIndex" :disable-touch="true"
            @change="onSwiperChange">
      <swiper-item class="swiper-item" v-for="(item, index) in questionList" :key="index">
        <Single :options="questionList[currentIndex]" @change="onSingleChange"
                v-if="questionList[currentIndex] && questionList[currentIndex].question_type === 1" />
        <Multiple :options="questionList[currentIndex]" @change="onSingleChange"
                  v-if="questionList[currentIndex] && questionList[index].question_type === 2" />
        <Indefinite :options="questionList[currentIndex]" @change="onSingleChange"
                    v-if="questionList[currentIndex] && questionList[index].question_type === 3" />
        <Judg :options="questionList[currentIndex]" @change="onSingleChange"
              v-if="questionList[currentIndex] && questionList[index].question_type === 4" />
        <Completion :options="questionList[currentIndex]" @change="onInputChange"
                    v-if="questionList[currentIndex] && questionList[index].question_type === 5" />
        <Short :options="questionList[currentIndex]" @change="onInputChange"
               v-if="questionList[currentIndex] && questionList[currentIndex].question_type === 6" />
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" :is-end="isEnd" :is-start="isStart" :test="true" 
                v-if="questionList[currentIndex]"
               :currentIndex="currentIndex" 
               :time="time" @timeup="onTimeUp"
               @submit-paper="submitPaper" @next="handleNext" @prev="handlePrev">
    </AnswerBar>
  </view>
</template>

<script>
import AnswerHead from "../components/answerHead/index";
import Single from "../components/single/index";
import Multiple from "../components/multiple/index";
import Judg from "../components/judg/index";
import Indefinite from "../components/indefinite/index";
import Completion from "../components/completion/index";
import Short from "../components/short/index";
import AnswerBar from "../components/answerBar/index"
import CustomHeader from "@/components/custom-header"
import { browser } from '@/mixins/index'

import {
  practiceStart,
  practiceQuestion,
  practiceAnswer,
} from "@/api/course";

export default {
  name: "answer",
  mixins: [browser],
  components: {
    AnswerHead,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    AnswerBar,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '随堂练习',
      noticeText: '在考试过程中不得弄虚作假，严禁采用任何作弊手段，遵纪守法，保证考试数据真实可信。',

      lesson_id: 0,
      course_id: 0,
      last_question_id: 0,

      serialNumber: 0,
      prevIndex: -1,
      currentIndex: 0,
      disableTouch: true,
      duration: 600,
      notice: false,

      total: 0,
      time: 1000,
      frequency: 0,

      answerSheet: [],
      questionList: [],
      userAnswerMap: {},
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
    }
  },
  onLoad(query) {
    let { course_id, lesson_id } = query
    this.course_id = course_id
    this.lesson_id = lesson_id
    this.createQuestion();
  },
  onReady() {
    if (!this.$store.getters.is_examination) {
      this.notice = true
      this.$store.commit('SET_EXAMINATION', true)
      setTimeout(() => { this.notice = false }, 6000)
    }
  },
  methods: {
    onCustomBack() {
      this.showModalForBack()
    },

    showModalForBack() {
      uni.showModal({
        title: '提示',
        content: '随堂考试，您正在进行随堂考试，确定退出后本次学习将不计入相应学时',
        showCancel: true,
        success: ({ confirm, cancel }) => {
          if (confirm) {
            this.goBack()
          }
        }
      })
    },

    goBack() {
      let url = `/pages/studys/courseDetail/index`
      let query = `?lesson_id=${this.lesson_id}&course_id=${this.course_id}&autoplay=0`
      uni.redirectTo({ url: url + query })
    },

    getPath(url, query) {
      let params = ''
      Object.keys(query).forEach((key) => { params += `&${key}=${query[key]}` })
      params = params.replace(/&?/, '?')
      return url + params
    },

    getQuery(prevIndex) {
      let index = prevIndex !== undefined ? prevIndex : this.currentIndex
      let question = this.questionList[index]
      let question_id = question.question_id
      let practice_id = this.practice_id
      let course_id = this.course_id
      let lesson_id = this.lesson_id
      let answer = this.userAnswerMap[question_id] || {answer: []}

      return { practice_id, question_id, course_id, lesson_id, answer }
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
    },

    handlePrev() {
      if (!this.isStart) {
        if (this.disableTouch) {
          uni.showToast({ title: '答案不能留空', icon: 'none' })
        } else {
          this.prevIndex = this.currentIndex
          this.currentIndex = this.currentIndex - 1
        }
      }
    },

    handleNext() {
      if (!this.isEnd) {
        if (this.disableTouch) {
          uni.showToast({ title: '答案不能留空', icon: 'none' })
        } else {
          this.prevIndex = this.currentIndex
          this.currentIndex = this.currentIndex + 1
        }
      }
    },

    onSwiperChange({ detail }) {
      this.disableTouch = true

      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }

      if (this.isStart) {
        uni.showToast({ title: '已经是第一题了', icon: 'none' })
      } else if (this.isEnd) {
        uni.showToast({ title: '已经是最后一题了', icon: 'none' })
      }

      this.submitAnswer(this.prevIndex)
    },

    cacheAnswer(answer) {
      let key = answer.question_id
      this.userAnswerMap[key] = answer
      this.disableTouch = false
    },

     onTimeUp() {
      if (this.isEnd) {
        this.submitPaper()
      } else {
        this.submitAnswer(this.currentIndex)
        this.prevIndex = this.currentIndex
        this.currentIndex = this.currentIndex + 1
      }
    },

    async submitPaper() {
      let url = `/pages/studys/classTestMode/result/index`
      let { practice_id, question_id, course_id, lesson_id, answer } = this.getQuery(this.currentIndex)
      let query = { practice_id, course_id, lesson_id }
      let path = this.getPath(url, query)

      let params = { practice_id, question_id: question_id, answer: answer.answer }
      let res = await practiceAnswer(params)
      if (res.code === 0) {
        uni.redirectTo({ url: path })
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
        setTimeout(() => { uni.redirectTo({ url: path })}, 800)
      }
    },

    async submitAnswer(prevIndex) {
      let { practice_id, question_id, answer } = this.getQuery(prevIndex)
      let params = { practice_id, question_id: question_id, answer: answer.answer }
      
      let res = await practiceAnswer(params)
      if (res.code === 0) {
        this.practiceQuestion(this.currentIndex)
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },

    async practiceQuestion(index) {
      let practice_id = this.practice_id
      let question_id = this.questionList[index]?.question_id
      if (!question_id) return;
      let params = { question_id, practice_id }
      let res = await practiceQuestion(params)
      if (res.code === 0) {
        this.time = res.data.timeout
      }
    },

    async createQuestion() {
      const data = { lesson_id: this.lesson_id };
      const res = await practiceStart(data);
      if (res.code === 0) {
        let { practice_id, question, last_id, times } = res.data
        let list = question.map(item => { item.answer = []; return item; })
        let index = list.findIndex(item => item.question_id === last_id)

        this.currentIndex = (index !== -1 ? index : 0)
        this.total = list.length
        this.frequency = times
        this.questionList = list
        this.practice_id = practice_id
        this.last_question_id = last_id

        this.initQuestion(last_id, question)
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none'})
      }
    },

    initQuestion() {
      this.practiceQuestion(this.currentIndex)
    }
  },
};
</script>

<style lang="scss" scoped>
.answer {
  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;

  .swiper {
    width: 100%;
    height: 100%;
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