<template>
  <view class="answer">
    <uni-notice-bar v-if="notice" scrollable single showIcon color="#E2E227" background-color="#000" text="答完当前题，可左右滑动。"></uni-notice-bar>
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            :disable-touch="disableTouch" @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.question_type === 7 }"
                   @touchmove="oonTouchmove" v-for="(item, index) in questionList" :key="index">
        <Single :options="item" :userAnswer="getCurrAnswer(index)" @change="onSingleChange"
                v-if="item.question_type === 1" />
        <Multiple :options="item" :userAnswer="getCurrAnswer(index)" @change="onSingleChange"
                  v-if="item.question_type === 2" />
        <Indefinite :options="item" :userAnswer="getCurrAnswer(index)" @change="onSingleChange"
                    v-if="item.question_type === 3" />
        <Judg :options="item" :userAnswer="getCurrAnswer(index)" @change="onSingleChange"
              v-if="item.question_type === 4" />
        <Completion :options="item" :userAnswer="getCurrAnswer(index)" @change="onInputChange"
                    v-if="item.question_type === 5" />
        <Short :options="item" :userAnswer="getCurrAnswer(index)" @change="onInputChange"
               v-if="item.question_type === 6" />
      </swiper-item>
    </swiper>
    <answerBar class="bar" :is-end="isEnd" :is-start="isStart" @submit-paper="submitPaper" @next="handleNext"
               @prev="handlePrev">
    </answerBar>
  </view>
</template>

<script>
import AnswerHead from "../components/answerHead/index.vue";
import Single from "../components/single/index.vue";
import Multiple from "../components/multiple/index.vue";
import Judg from "../components/judg/index.vue";
import Indefinite from "../components/indefinite/index.vue";
import Completion from "../components/completion/index.vue";
import Short from "../components/short/index.vue";
import answerBar from "../components/answerBar/index.vue"

import {
  practiceStart,
  practiceAnswer,
} from "@/api/question";

export default {
  name: "answer",
  components: {
    AnswerHead,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    answerBar,
  },
  data() {
    return {
      lesson_id: 0,
      course_id: 0,
      prevIndex: -1,
      currentIndex: 0,
      nextIndex: 1,
      disableTouch: true,
      duration: 300,
      total: 0,
      questionList: [],
      answer: {},
      userAnswerMap: {},
      notice: true
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
  onShow() {
    this.duration = 300;
    setTimeout(() => { this.notice = false}, 1500)
  },
  onLoad(query) {
    let { course_id, lesson_id } = query
    this.course_id = course_id
    this.lesson_id = lesson_id
    this.createQuestion();
  },
  methods: {
    checkInputAnswer(val) {
      return val !== undefined && val !== '' && val !== null
    },

    onSingleChange(answer) {
      console.log('onSingleChange', answer);
      let flag = false
      this.answer = answer
      if (Array.isArray(answer.answer)) {
        flag = answer.answer.some(val => {
          return val !== undefined && val !== '' && val !== null
        })
      }
      if (flag) {
        this.cacheAnswer(answer)
        this.disableTouch = false
      } else {
        uni.showToast({ title: '答案不能留空', icon: 'none' })
        this.disableTouch = true
      }
    },

    onInputChange(answer) {
      let flag = false
      this.answer = answer
      if (Array.isArray(answer.answer)) {
        flag = answer.answer.some(val => {
          return val !== undefined && val !== '' && val !== null
        })
      } else {
        flag = this.checkInputAnswer(answer.answer)
      }
      if (flag) {
        this.cacheAnswer(answer)
        this.disableTouch = false
      } else {
        uni.showToast({ title: '答案不能留空', icon: 'none' })
        this.disableTouch = true
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
      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }
      let prevAnswer = this.getCurrAnswer(this.prevIndex)
      let currAnswer = this.getCurrAnswer(this.currentIndex)
      // console.log(this.isRight, prevAnswer, currAnswer, this.prevIndex, this.currentIndex, detail);
      if (this.isRight && prevAnswer) {
        this.disableTouch = false
        this.submitAnswer(prevAnswer)
      } else if (currAnswer) {
        this.disableTouch = false
      } else {
        this.disableTouch = true
      }
    },

    oonTouchmove() {
      // console.log('detail', detail);
    },

    onAnimationfinish({ detail }) {
      // console.log('detail', detail);
    },

    getCurrAnswer(index) {
      let key = this.questionList[index].question_id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      console.log('cacheAnswer', answer);
      let key = answer.question_id
      this.userAnswerMap[key] = answer
    },

    async submitPaper() {
      if (!this.disableTouch) {
        let index = this.currentIndex
        let key = this.questionList[index].question_id
        let currAnswer = this.userAnswerMap[key]
        let data = { practice_id: +this.practice_id, question_id: key, answer: currAnswer.answer }
        const res = await practiceAnswer(data);
        if (res.code === 0) {
          let url = `/pages/examinations/classTestMode/result/index`
          let query = `?practice_id=${this.practice_id}&course_id=${this.course_id}&lesson_id=${this.lesson_id}`
          setTimeout(() => {
            uni.redirectTo({ url: url + query });
          }, 800);
          this.disableTouch = false
        }
      } else {
        uni.showToast({ title: '考试不能留空', icon: 'none' })
      }
    },

    async submitAnswer(prevAnswer) {
      let data = { practice_id: this.practice_id, question_id: prevAnswer.question_id, answer: prevAnswer.answer }
      const res = await practiceAnswer(data);
      if (res.code === 0) {
        // this.duration = 0;
        this.disableTouch = true
      }
    },
    
    async createQuestion() {
      const data = { lesson_id: this.lesson_id };
      const res = await practiceStart(data);
      if (res.code === 0) {
        this.practice_id = res.data.practice_id
        this.questionList = res.data.question
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