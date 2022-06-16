<template>
  <view class="answer">
    <custom-header :title="defaultTitle"></custom-header>

    <transition name="notice">
      <uni-notice-bar v-if="notice" showIcon color="#E2E227" background-color="#f8f8f8"
                      text="在考试过程中不得弄虚作假，严禁采用任何作弊手段，遵纪守法，保证考试数据真实可信。"
                      class="notice" />
    </transition>
                    
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" :current="currentIndex" :disable-touch="disableTouch"
            @change="onSwiperChange">
      <swiper-item class="swiper-item" v-for="(item, index) in answerSheet" :key="index">
        <Single :options="questionList[index]" @change="onSingleChange" v-if="questionList[index] && questionList[index].question_type === 1" />
        <Multiple :options="questionList[index]" @change="onSingleChange" v-if="questionList[index] && questionList[index].question_type === 2" />
        <Indefinite :options="questionList[index]" @change="onSingleChange" v-if="questionList[index] && questionList[index].question_type === 3" />
        <Judg :options="questionList[index]" @change="onSingleChange" v-if="questionList[index] && questionList[index].question_type === 4" />
        <Completion :options="questionList[index]" @change="onInputChange" v-if="questionList[index] && questionList[index].question_type === 5" />
        <Short :options="questionList[index]" @change="onInputChange" v-if="questionList[index] && questionList[index].question_type === 6" />
      </swiper-item>
    </swiper>
              
    <AnswerBar class="bar" :is-end="isEnd" :is-start="isStart" 
               v-if="questionList[currentIndex]"
               :currentIndex="currentIndex" :time="questionList[currentIndex].timeout"
               @timeup="onTimeUp" @submit-paper="submitPaper" @next="handleNext" @prev="handlePrev">
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
      lesson_id: 0,
      course_id: 0,

      prevIndex: -1,
      currentIndex: 0,
      disableTouch: true,
      duration: 600,
      notice: true,

      total: 0,
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
  onReady() {
    setTimeout(() => { this.notice = false }, 6000)
  },
  onLoad(query) {
    let { course_id, lesson_id } = query
    this.course_id = course_id
    this.lesson_id = lesson_id
    this.createQuestion();
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
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) {
        this.cacheAnswer(answer)
        this.disableTouch = false
      }
    },

    onInputChange(answer) {
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) {
        this.cacheAnswer(answer)
        this.disableTouch = false
      }
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

      let currAnswer = this.getCurrAnswer(this.currentIndex)
      if (currAnswer) {
        this.disableTouch = false
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

      let inAnswerSheet = this.answerSheet[index]
      let inQuestionList = this.questionList[index]
      let question_id = ''

      if (inAnswerSheet && !inQuestionList) {
        question_id = inAnswerSheet
        this.practiceQuestion(question_id, index)
      }
    },

    getCurrAnswer(index) {
      let question_id = this.questionList[index].question_id
      let answer = this.userAnswerMap[question_id]
      return answer ? answer : undefined 
    },

    cacheAnswer(answer) {
      let key = answer.question_id
      this.userAnswerMap[key] = answer
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
      let answer = this.userAnswerMap[question_id]

      return { practice_id, question_id, course_id, lesson_id, answer}
    },

    async onTimeUp () {
      let url = `/pages/studys/classTestMode/result/index`
      let { practice_id, course_id, lesson_id, answer } = this.getQuery(this.currentIndex)
      let query = { practice_id, course_id, lesson_id }
      let path = this.getPath(url, query)

      let params = { practice_id, question_id: answer.question_id, answer: answer.answer }
      let res = await practiceAnswer(params)
      if (res.code === 0) {
        uni.redirectTo({ url: path })
      }
    },


    async submitPaper() {
      let url = `/pages/studys/classTestMode/result/index`
      let { practice_id, course_id, lesson_id, answer } = this.getQuery(this.currentIndex)
      let query = { practice_id, course_id, lesson_id }
      let path = this.getPath(url, query)

      let params = { practice_id, question_id: answer.question_id, answer: answer.answer }
      let res = await practiceAnswer(params)
      if (res.code === 0) {
        uni.redirectTo({ url: path })
      }
    },

    async submitAnswer(prevIndex) {
      let { practice_id, question_id, answer } = this.getQuery(prevIndex)
      let params = { practice_id, question_id: answer.question_id, answer: answer.answer }
      let res = await practiceAnswer(params)
    },

    async practiceQuestion(question_id, index) {
      let practice_id = this.practice_id
      let params = { question_id, practice_id }
      let res = await practiceQuestion(params)
      if (res.code === 0) {
        let question = res.data
        question.answer = []
        this.questionList[index] = question 
      }
    },

    async createQuestion() {
      const data = { lesson_id: this.lesson_id };
      const res = await practiceStart(data);
      if (res.code === 0) {
        this.practice_id = res.data.practice_id
        this.answerSheet = res.data.question
        this.total = res.data.question.length
        this.initQuestions(res.data.question)
      }
    },

    async initQuestions(arr) {
      let practice_id = this.practice_id
      let params1 = {question_id: arr[0], practice_id}
      let params2 = {question_id: arr[1], practice_id}
      
      let res = await Promise.all([practiceQuestion(params1), practiceQuestion(params2) ])
      if (res.length) {
        let list = res.map(item => {
          item.data.answer = []
          return  item.data
        })
        console.log(list, this.answerSheet);
        this.questionList = JSON.parse(JSON.stringify(list))
      }
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


.notice-enter-active, .notice-leave-active {
  transition: opacity 6s;
}
.notice-enter, .notice-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>