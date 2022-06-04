<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" v-for="(item, index) in questionList" :key="index">
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
    <answerBar class="bar" :is-end="isEnd" :is-start="isStart" :pass="pass" :analysis="analysis" @submit-paper="submitPaper"
               @next="handleNext" @prev="handlePrev">
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
      practice_id: '',
      lesson_id: '',
      next_lesson_id: '',
      course_id: '',
      pass: false,
      analysis: true,
      // 当前的swiper 索引
      prevIndex: -1,
      nextIndex: 1,
      currentIndex: 0,
      // swiper 动画时间
      duration: 300,
      // 考题试卷
      total: 0,
      questionList: [],
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
    let { practice_id, lesson_id, next_lesson_id, pass, course_id } = query
    this.practice_id = practice_id
    this.lesson_id = lesson_id
    this.course_id = course_id
    this.next_lesson_id = next_lesson_id
    this.pass = !!pass
    this.createQuestion();
  },
  methods: {
    // 上一题
    handlePrev() {
      if (!this.isStart) {
        this.currentIndex = this.currentIndex - 1
      }
    },
    // 下一题
    handleNext() {
      if (!this.isEnd) {
        this.currentIndex = this.currentIndex + 1
      }
    },

    onSwiperChange({ detail }) {
      this.currentIndex = detail.current
      this.prevIndex = detail.current - 1
      this.nextIndex = detail.current + 1
    },

    onAnimationfinish({ detail }) {
    },

    submitPaper() {
      if (this.pass) {
        let course_id = this.course_id
        let url = '/pages/studys/courseDetail/index'
        let query = `?course_id=${course_id}&lesson_id=${this.next_lesson_id}`
        uni.reLaunch({ url: url + query })
      } else {
        let url = `/pages/examinations/classTestMode/answer/index`
        let query = `?practice_id=${this.practice_id}&lesson_id=${this.lesson_id}&course_id=${course_id}`
        uni.redirectTo({ url: url + query })
      }
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