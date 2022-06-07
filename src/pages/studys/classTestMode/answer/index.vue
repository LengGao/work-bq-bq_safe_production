<template>
  <view class="answer">
    <uni-notice-bar v-if="notice" scrollable single showIcon color="#E2E227" background-color="#000"
                    text="答完当前题，可左右滑动。"></uni-notice-bar>
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" :current="currentIndex" :disable-touch="disableTouch"
            @change="onSwiperChange">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.question_type === 7 }"
                   v-for="(item, index) in questionList" :key="index">
        <Single :options="item" @change="onSingleChange" v-if="item.question_type === 1" />
        <Multiple :options="item" @change="onSingleChange" v-if="item.question_type === 2" />
        <Indefinite :options="item" @change="onSingleChange" v-if="item.question_type === 3" />
        <Judg :options="item" @change="onSingleChange" v-if="item.question_type === 4" />
        <Completion :options="item" @change="onInputChange" v-if="item.question_type === 5" />
        <Short :options="item" @change="onInputChange" v-if="item.question_type === 6" />
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" :is-end="isEnd" :is-start="isStart" @submit-paper="submitPaper" @next="handleNext"
               @prev="handlePrev">
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
import { browser } from '@/mixins/index'

import {
  practiceStart,
  practiceAnswer,
} from "@/api/question";

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
  },
  data() {
    return {
      lesson_id: 0,
      course_id: 0,

      prevIndex: -1,
      currentIndex: 0,
      disableTouch: true,
      duration: 300,
      notice: true,

      total: 0,
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
      
      if (this.isRight) {
        this.submitAnswer(this.prevIndex)
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

    async submitPaper() {
      let url = `/pages/studys/classTestMode/result/index`
      let { practice_id, course_id, lesson_id, answer } = this.getQuery()
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
      await practiceAnswer(params)
    },

    async createQuestion() {
      const data = { lesson_id: this.lesson_id };
      const res = await practiceStart(data);
      if (res.code === 0) {
        this.practice_id = res.data.practice_id
        this.questionList = res.data.question.map(item => { item.answer = []; return item; })
        this.total = res.data.question.length
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.answer {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
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