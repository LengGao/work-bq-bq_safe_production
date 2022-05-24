<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.question_type === 7 }"
                   v-for="(item, index) in questionList" :key="index">
        <template v-if="currentIndex === index || currentIndex - 1 === index || currentIndex + 1 === index">
          <Single :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onSingleChange"
                  v-if="item.question_type === 1" />
          <Multiple :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onSingleChange"
                    v-if="item.question_type === 2" />
          <Judg :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onSingleChange"
                v-if="item.question_type === 3" />
          <Indefinite :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onOtherChange"
                      v-if="item.question_type === 4" />
          <Completion :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onOtherChange"
                      v-if="item.question_type === 5" />
          <Short :options="item" :userAnswer="userAnswerList[currentIndex]" @change="onOtherChange"
                 v-if="item.question_type === 6" />
        </template>
      </swiper-item>
    </swiper>
    <ClassTestAnswerBar class="bar" :is-end="isEnd" :is-start="isStart" @submit-paper="submitAnswer" @next="handleNext"
                        @prev="handlePrev">
    </ClassTestAnswerBar>
  </view>
</template>

<script>
import AnswerHead from "../components2/answerHead";
import Single from "../components2/single";
import Multiple from "../components2/multiple";
import Judg from "../components2/judg";
import Indefinite from "../components2/indefinite";
import Completion from "../components2/completion";
import Short from "../components2/short";
import ClassTestAnswerBar from "../components2/ClassTestAnswerBar"

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
  name: "analysis",
  components: {
    AnswerHead,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    ClassTestAnswerBar,
  },

  data() {
    return {
      lesson_id: 60,
      // 当前的swiper 索引
      prevIndex: 0,
      nextIndex: 0,
      currentIndex: 0,
      // swiper 动画时间
      duration: 300,
      // 考题试卷
      total: 0,
      questionList: [],
      // 答题
      answer: [],
      userAnswerList: [],
    };
  },
  computed: {
    // 是否最后一题
    isEnd() {
      return this.currentIndex >= this.total < -1
    },
    isStart() {
      return this.currentIndex <= 0
    }
  },
  onShow() {
    this.duration = 300;
  },
  onLoad(query) {
    // isContinue 是否为继续做题
    // let { lesson_id = 60, title = "测试提" } = query
    let lesson_id = 60, title = '测试提'
    this.lesson_id = lesson_id
    uni.setNavigationBarTitle({ title })
    this.createQuestion(lesson_id);
  },
  methods: {
    // ------------------ 题目选择事件
    // 收集选择题回答
    onSingleChange(answer) {
      this.answer = answer
      this.cacheAnswer(answer)
    },
    // 收集填空题回答
    onOtherChange(answer) {
      this.answer = answer
      this.cacheAnswer(answer)
    },
    // 上一题
    handlePrev() {
      !this.isStart && this.currentIndex--;
    },
    // 下一题
    handleNext() {
      !this.isEnd && this.currentIndex++;
    },
    // ------------------ swiper start
    onSwiperChange({ detail }) {

      // // 不能留空
      // if (this.answer.length) {
      //   // 正常操作
      //   console.log('detail', detail, this.currentIndex);
      //   this.submitAnswer()
      // } else if (this.userAnswerList[detail.current]) {
      //   // 答完题目后切换

      // } else {
      //   // 未答题 禁止切换
      //   uni.showToast({ title: '考试不能留空', icon: 'none' })
      // }
    },

    onAnimationfinish({ detail }) {
      if (this.prevIndex === -1 || this.nextIndex === this.total) {
        this.checkSwiperIndex()
      } else {
        this.prevIndex = detail.current - 1
        this.nextIndex = detail.current + 1
      }
    },

    checkSwiperIndex() {
      if (this.isStart) {
        uni.showToast({ icon: "none", title: "已经是第一题了" });
        return false
      } else if (this.isEnd) {
        uni.showToast({ icon: "none", title: "已经是最后一题了" });
        return false
      } else {
        return true
      }
    },
    // ------------------ swiper end
    // 缓存答案  先不删 防止又要改回来
    cacheAnswer(answer) {
      console.log('cacheAnswer', answer);
      // let index = this.userAnswerList.findIndex(item => item.question_id === answer.question_id)
      // if (index !== -1) {
      //   this.userAnswerList[index] = answer
      // } else {
      //   this.userAnswerList.push(answer)
      // }
    },
    // 提交答案
    async submitAnswer() {
      let url = `/pages/examinations/classTestMode/result/index`
      // let query = 
      let data = { practice_id: this.practice_id, answer: this.answer }
      const res = await practiceAnswer(data);
      if (res.code === 0) {
        uni.showToast({ title: '提交成功', icon: 'success' })
        this.duration = 0;
        setTimeout(() => {
          uni.navigateTo({ url: `/testResults/index?logId=${this.logId}` });
        }, 500);
        this.answer = []
      }
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