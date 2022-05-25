<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            :disable-touch="disableTouch" 
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.question_type === 7 }"
                  @touchmove="oonTouchmove"
                   v-for="(item, index) in questionList" :key="index">
        <!-- <template v-if="currentIndex === index || currentIndex - 1 === index || currentIndex + 1 === index"> -->
        <Single :options="item" :userAnswer="getAnswer(item.question_id)" @change="onSingleChange"
                v-if="item.question_type === 1" />
        <Multiple :options="item" :userAnswer="getAnswer(item.question_id)" @change="onSingleChange"
                  v-if="item.question_type === 2" />
        <Judg :options="item" :userAnswer="getAnswer(item.question_id)" @change="onSingleChange"
              v-if="item.question_type === 3" />
        <Indefinite :options="item" :userAnswer="getAnswer(item.question_id)" @change="onSingleChange"
                    v-if="item.question_type === 4" />
        <Completion :options="item" :userAnswer="getAnswer(item.question_id)" @change="onInputChange"
                    v-if="item.question_type === 5" />
        <Short :options="item" :userAnswer="getAnswer(item.question_id)" @change="onInputChange"
               v-if="item.question_type === 6" />
        <!-- </template> -->
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

/**
 * 1，题目显示
 * 2，切换控制
 * 3，答案保留
 */

import {
  practiceStart,
  practiceAnswer,
  practiceAnalyse,
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
      lesson_id: 60,
      // 当前的swiper 索引
      prevIndex: -1,
      nextIndex: 1,
      currentIndex: 0,
      disableTouch: true,
      // swiper 动画时间
      duration: 300,
      // 考题试卷
      total: 0,
      questionList: [],
      // 答题
      answer: {},
      userAnswerMap: {},
    };
  },
  computed: {
    // 是否最后一题
    isEnd() {
      return this.currentIndex >= this.total - 1
    },
    isStart() {
      return this.currentIndex <= 0
    },
  },
  onShow() {
    this.duration = 300;
  },
  onLoad(query) {
    // let { lesson_id = 60, title = "测试提" } = query
    let lesson_id = 60, title = '随堂练习'
    this.lesson_id = lesson_id
    uni.setNavigationBarTitle({ title })
    this.createQuestion(lesson_id);
  },
  methods: {

    checkInputAnswer(val) {
      if (val !== undefined && val !== '' && val !== null) {
        return true
      } else {
        return false
      }
    },
    
    onSingleChange(answer) {
      this.answer = answer
      let flag = false
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

    onMultipleChange() {

    },

    
    onInputChange(answer) {
      this.answer = answer
      let flag = false
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
          this.currentIndex = this.currentIndex - 1
        }
      }
    },
    
    handleNext() {
      if (!this.isEnd) {
        if (this.disableTouch) {
          uni.showToast({ title: '答案不能留空', icon: 'none' })
        } else {
          this.currentIndex = this.currentIndex + 1
        }
      }
    },
    // ------------------ swiper start
    oonTouchmove() {
    },
    onSwiperChange({ detail }) {
      this.currentIndex = detail.current
      let qid = this.questionList[this.currentIndex].question_id
      let answer = this.userAnswerMap[qid]
      let hasAnswer = answer ? true : false
      console.log(
        'onSwiperChange',
        detail,
        qid,
        answer,
        this.questionList,
        this.currentIndex,
        this.userAnswerMap
        );
      if (hasAnswer) {
        this.disableTouch = false
      } else {
        this.disableTouch = true
      }
    },

    onAnimationfinish({ detail }) {
      let currIndex = detail.current
      //  if (this.prevIndex === 0 && this.prevIndex === currIndex) {
      //   uni.showToast({ icon: "none", title: "已经是第一题了" });
      // } else if (this.nextIndex === this.total - 1 && this.nextIndex === currIndex) {
      //   uni.showToast({ icon: "none", title: "已经是最后一题了" });
      // } else {
        this.prevIndex = currIndex
        this.nextIndex = currIndex
      // }
    },
    // ------------------ swiper end
    getAnswer(question_id) {
      return this.userAnswerMap[question_id] || {}
    },
    
    cacheAnswer(answer) {
      console.log('answer',answer);
      this.userAnswerMap[answer.question_id] = answer
      this.submitPaper()
    },

    submitPaper() {
      if (!this.disableTouch) {
        this.submitAnswer()
      } else {
        uni.showToast({ title: '考试不能留空', icon: 'none' })
      }
    },

    async submitAnswer() {
      let data = { practice_id: this.practice_id, answer: this.userAnswerMap }
      // const res = await practiceAnswer(data);
      // if (res.code === 0) {
        uni.showToast({ title: '提交成功', icon: 'success' })
        this.duration = 0;
        setTimeout(() => {
          let url = `/pages/examinations/classTestMode/result/index`
          let query = `?practice_id=${this.practice_id}&lesson_id=${this.lesson_id}&grade=${80}`
          uni.navigateTo({ url: url + query });
        }, 500);
      // }
    },
    // 获取章节练习题目
    async createQuestion(lesson_id) {
      const data = { lesson_id };
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