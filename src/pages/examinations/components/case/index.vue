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
          <text class="text" v-if="questionList[currentIndexCase]">（{{ title }}）</text>
        </view>
        <view class="child-header-actions">
          <view class="prev" :class="{'disabled': isStart }" @click="handlePrev">上一题</view>
          <view class="next" :class="{'disabled': isEnd }" @click="handleNext">下一题</view>
        </view>
      </view>

      <swiper class="child-content swiper" @change="onSwiperChange" :current="currentIndexCase" :disable-touch="true">
        <swiper-item class="swiper-item" v-for="(item, index) in options.child" :key="'sub_' + index">
          <scroll-view scroll-y class="scroll-view">
            <Single :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onSingleChange"
                    v-if="questionList[index] && questionList[index].question_child_type === 1" />
            <Multiple :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onSingleChange"
                      v-if="questionList[index] && questionList[index].question_child_type === 2" />
            <Indefinite :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onSingleChange"
                        v-if="questionList[index] && questionList[index].question_child_type === 3" />
            <Judg :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onSingleChange"
                  v-if="questionList[index] && questionList[index].question_child_type === 4" />
            <Completion :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onInputChange"
                        v-if="questionList[index] && questionList[index].question_child_type === 5" />
            <Short :options="questionList[index]" :model="model" :isAnalysis="isAnalysis" @change="onInputChange"
                   v-if="questionList[index] && questionList[index].question_child_type === 6" />
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
import { getQuestionDetail } from "@/api/question";

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
    isAnalysis: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      prevIndexCase: -1,
      currentIndexCase: 0,

      question_bank_id: 0,
      isOpen: true,

      total: 0,
      userAnswerMap: {},
      questionList: [],

      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "不定项题",
        4: "判断题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
      sourceMap: {
        "wrong": 1,
        "favorites": 1,
        "chapter": 1,
        "examRandom": 2,
        "examAutonomy": 2,
        "examRecord": 3,
        "memory": 3
      },
    };
  },
  computed: {
    isEnd() {
      return this.currentIndexCase >= this.total - 1
    },
    isStart() {
      return this.currentIndexCase <= 0
    },
    isRight() {
      return this.currentIndexCase > this.prevIndexCase
    },
    title() {
      let types = this.typeMap
      let type = this.questionList[this.currentIndexCase].question_child_type
      return types[type]
    }
  },
  mounted() {
    this.total = this.options.child.length;
    this.question_bank_id = this.$store.getters.questionBankInfo.id
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
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) { this.cacheAnswer(answer) }
    },

    onInputChange(answer) {
      let flag = this.checkInputAnswer(answer.answer)
      if (flag) { this.cacheAnswer(answer) }
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
      } else {
        this.$emit('submitAnswer')
      }

      this.prevfetch()
    },

    prevfetch() {
      let index = 0
      if (this.isRight) {
        index = this.currentIndex + 1
      } else {
        index = this.currentIndex - 1
      }
      if (index > this.total - 1 || index < 0) return;

      let inAnswerSheet = this.options.child[index]
      let inQuestionList = this.questionList[index]

      if (inAnswerSheet && !inQuestionList) {
        let question_id = inAnswerSheet
        this.getQuestionDetail(question_id, index)
      }
    },

    getCurrAnswer(index) {
      let key = this.questionList[index].id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      let key = answer.id
      this.userAnswerMap[key] = answer
      if ((this.isStart || this.isEnd) && answer) {
        this.$emit('onCaseChange', this.currentIndexCase, answer)
        this.$emit('submitAnswer')
      } else if (answer) {
        this.$emit('onCaseChange', this.currentIndexCase, answer)
      }
    },

    async getQuestionDetail(question_id, index) {
      let params = { question_id: question_id,  question_bank_id: this.question_bank_id, exam_log_id: this.logId }
      if (question_id) {
        let res = await getQuestionDetail(params)
        if (res.code === 0) {
          this.questionList[index] = res.data
        }
      }
    },

    async init() {
      let exam_log_id = this.logId
      let childs = this.options.child
      let question_bank_id = this.question_bank_id

      let params1 = { question_bank_id: question_bank_id, question_id: childs[0], exam_log_id }
      let params2 = { question_bank_id: question_bank_id, question_id: childs[1], exam_log_id }
      let params3 = { question_bank_id: question_bank_id, question_id: childs[2], exam_log_id }
      let res = await Promise.all([getQuestionDetail(params1), getQuestionDetail(params2), getQuestionDetail(params3)])
      if (res.length) {
        let list = res.map(item => item.data)
        let arr = [].fill({}, 0, this.total)
        arr[0] = list[0]
        arr[1] = list[1]
        arr[2] = list[2]
        this.questionList = arr
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
      .disabled {
        color: #ddd;
        border-color: #ddd;
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