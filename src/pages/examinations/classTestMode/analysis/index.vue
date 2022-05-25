<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.question_type === 7 }"
                   @touchmove="oonTouchmove" v-for="(item, index) in questionList" :key="index">
        <template v-if="currentIndex === index || currentIndex - 1 === index || currentIndex + 1 === index">
        <Single :options="item" :analysis="analysis" @change="onSingleChange" v-if="item.question_type === 1" />
        <Multiple :options="item" :analysis="analysis" @change="onSingleChange" v-if="item.question_type === 2" />
        <Judg :options="item" :analysis="analysis" @change="onSingleChange" v-if="item.question_type === 3" />
        <Indefinite :options="item" :analysis="analysis" @change="onSingleChange" v-if="item.question_type === 4" />
        <Completion :options="item" :analysis="analysis" @change="onInputChange" v-if="item.question_type === 5" />
        <Short :options="item" :analysis="analysis" @change="onInputChange" v-if="item.question_type === 6" />
        </template>
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
      analysis: true
    };
  },
  computed: {    
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
    // isContinue 是否为继续做题
    let { practice_id, grader, } = query
    this.practice_id = 600 || practice_id
    this.grader = grader || 80
    this.createQuestion();
  },
  methods: {
    // 上一题
    handlePrev() {
      if (!this.isStart) {
        if (this.disableTouch) {
          uni.showToast({ title: '答案不能留空', icon: 'none' })
        } else {
          this.currentIndex = this.currentIndex - 1
        }
      }
    },
    // 下一题
    handleNext() {
      if (!this.isEnd) {
        if (this.disableTouch) {
          uni.showToast({ title: '答案不能留空', icon: 'none' })
        } else {
          this.currentIndex = this.currentIndex + 1
        }
      }
    },

    onSwiperChange({ detail }) {
      this.currentIndex = detail.current
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

    // 获取章节练习题目
    async createQuestion() {
      const data = { practice_id: this.practice_id };
      const res = await practiceAnalyse(data);
      if (res.code === 0) {
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