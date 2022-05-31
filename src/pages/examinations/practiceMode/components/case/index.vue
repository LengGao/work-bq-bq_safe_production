<template>
  <div class="case">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <view class="drawer" :class="{ 'drawer--open': isOpen }">
      <view class="btn" @click="handleToggle">
        <view class="left" :class="{ 'left--active': isOpen }"></view>
        <view class="right" :class="{ 'right--active': isOpen }"></view>
      </view>
      <view class="child-header">
        <view class="child-header-title">案例题 {{ serialNumber }}-{{ currentIndexCase + 1 }}
          <text class="text">（{{typeMap[question.question_child_type]}}）</text>
        </view>
        <view class="child-header-actions">
          <view class="prev" @click="handlePrev">上一题</view>
          <view class="next" @click="handleNext">下一题</view>
        </view>
      </view>

      <swiper class="child-content swiper" @change="onSwiperChange" :current="currentIndexCase" :disable-touch="true">
        <swiper-item class="swiper-item" v-for="(item, index) in options.child" :key="'sub_' + index">
          <scroll-view scroll-y class="scroll-view">
            <Single :options="question" @change="onSingleChange"
                    v-if="question && question.question_child_type === 1" />
            <Multiple :options="question" @change="onSingleChange"
                      v-if="question && question.question_child_type === 2" />
            <Indefinite :options="question" @change="onSingleChange"
                        v-if="question && question.question_child_type === 3" />
            <Judg :options="question" @change="onSingleChange" v-if="question && question.question_child_type === 4" />
            <Completion :options="question" @change="onInputChange"
                        v-if="question && question.question_child_type === 5" />
            <Short :options="question" @change="onInputChange" v-if="question && question.question_child_type === 6" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerHead from "../answerHead/index";
import Single from "../single/index";
import Multiple from "../multiple/index";
import Judg from "../judg/index";
import Indefinite from "../indefinite/index";
import Completion from "../completion/index";
import Short from "../short/index";
import {
  getQuestionDetail,
  practiceAnswerTheQuestion,
 } from "@/api/question";

export default {
  name: "case",
  components: {
    AnswerHead,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    uParse,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        child: [],
        title: "",
      }),
    },
    current: {
      type: Number,
      default: 0,
    },
    // 当前案例题序号
    serialNumber: {
      type: [Number, String],
      default: 0,
    },
    logId: {
      type: [Number, String],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    model: {
      type: String,
      default: "1",
    },
    type: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      isOpen: true,
      prevIndexCase: -1,
      currentIndexCase: 0,
      question: {},
      userAnswerMap: {},
      userAnswer: '',
      answerSheetArr: this.options.child || [],
      total: 0,
      isEnd: false,

      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "不定项题",
        4: "判断题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
    };
  },
  mounted() {
    this.total = this.options.child.length;
    this.init()
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

    handleToggle() {
      this.isOpen = !this.isOpen;
    },

    handlePrev() {
      if (this.currentIndexCase > 0) {
        this.prevIndexCase = this.currentIndexCase
        this.currentIndexCase = this.currentIndexCase - 1
      }
    },
    handleNext() {
      if (this.currentIndexCase < this.total - 1) {
        this.prevIndexCase = this.currentIndexCase
        this.currentIndexCase = this.currentIndexCase + 1
      }
    },

    onSwiperChange({ detail }) {
      if (detail.source === 'touch') {
        this.prevIndexCase = this.currentIndexCase
        this.currentIndexCase = detail.current
      }
      if (detail.current <= 0) {
        uni.showToast({ title: '已经是第一题了', icon: 'none' })
      } else if (detail.current >= this.total - 1) {
        uni.showToast({ title: '已经是最后一题了', icon: 'none' })
        this.isEnd = true
      }  else {
        this.isEnd = false
      }

      let question_id = this.answerSheetArr[this.prevIndexCase]
      this.getQuestionDetail(question_id)
      this.submitAnswer(question_id)
    },


    getCurrAnswer(key) {
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      let key = answer.id
      if (!this.userAnswerMap[key]) {
        this.userAnswerMap[key] = answer
      }
      if (this.isEnd && answer) {
        let questionBankInfo = this.$store.getters.questionBankInfo
        let data = { question_bank_id: questionBankInfo.id, question_id: answer.id, user_answer: answer.answer }
        practiceAnswerTheQuestion(data);
      }
      console.log('cacheAnswer', answer, this.userAnswerMap);
    },

    async submitAnswer(question_id) {
      let answer = this.getCurrAnswer(question_id)
      console.log('answer', this.prevIndexCase, answer);
      if (answer) {
        let questionBankInfo = this.$store.getters.questionBankInfo
        let data = { question_bank_id: questionBankInfo.id, question_id: answer.id, user_answer: answer.answer }
        const res = await practiceAnswerTheQuestion(data);
        if (res.code === 0) {
        }
      }
    },

    async init() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let index = this.currentIndexCase
      let question_id = this.options.child[index]
      console.log(question_id, this.options, this.currentIndexCase);
      if (question_id) {
        let params = { question_id: question_id, question_bank_id: questionBankInfo.id }
        let res = await getQuestionDetail(params)
        if (res.code === 0) {
          this.question = res.data
        }
      }
    },

    async getQuestionDetail(question_id) {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_id: question_id, question_bank_id: questionBankInfo.id }
      let res = await getQuestionDetail(params)
      if (res.code === 0) {
        this.question = res.data
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.case {
  height: 100%;
  overflow: hidden;
  .quetion-content {
    height: 90%;
    overflow-y: auto;
    padding: 0 40rpx;
  }
}
.drawer {
  box-sizing: border-box;
  width: 100%;
  height: 90%;
  position: absolute;
  top: 90%;
  bottom: 0;
  left: 0;
  transition: top 0.3s;
  background-color: #fff;
  &--open {
    top: 10%;
  }
  .btn {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    background-color: #eee;
    .left,
    .right {
      width: 50rpx;
      height: 12rpx;
      background-color: #ccc;
      transition: transform 0.3s;
    }
    .left {
      border-top-left-radius: 10rpx;
      border-bottom-left-radius: 10rpx;

      &--active {
        transform: rotate(20deg);
        margin-right: -4rpx;
      }
    }
    .right {
      border-top-right-radius: 10rpx;
      border-bottom-right-radius: 10rpx;
      &--active {
        transform: rotate(-20deg);
        margin-left: -4rpx;
      }
    }
  }
  .child-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 1px solid $uni-border-color;
    color: $uni-color-primary;
    &-title {
      font-weight: bold;
      .text {
        font-size: 24rpx;
      }
    }
    &-actions {
      display: flex;
      align-items: center;
      .prev,
      .next {
        padding: 8rpx 16rpx;
        border: 1rpx solid $uni-color-primary;
        font-size: 24rpx;
        margin-left: 10rpx;
        border-radius: 10rpx;
      }
    }
  }
  .child-content {
    box-sizing: border-box;
    height: calc(100% - 138rpx);
    padding: 10rpx 20rpx;
    .scroll-view {
      height: 100%;
    }
  }
}
</style>