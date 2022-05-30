<template>
  <view class="answer">
    <!-- <AnswerHead v-if="questionList[currentIndex]" :type="answerSheetArr[currentIndex].topic_type" :total="total"
                :serial-number="currentIndex + 1" /> -->
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.topic_type === 7 }"
                   v-for="(item, index) in answerSheetArr" :key="index">
        <Single :options="question" :userAnswer="userAnswer" @change="onSingleChange" v-if="question.question_type === 1" />
        <Multiple :options="item" :userAnswer="answer" @change="onSingleChange" v-if="item.question_type === 2" />
        <Indefinite :options="item" :userAnswer="userAnswer" @change="onSingleChange" v-if="item.question_type === 3" />
        <Judg :options="item" :userAnswer="userAnswer" @change="onSingleChange" v-if="item.question_type === 4" />
        <Completion :options="item" :userAnswer="userAnswer" @change="onOtherChange" v-if="item.question_type === 5" />
        <Short :options="item" :userAnswer="userAnswer" @change="onOtherChange" v-if="item.question_type === 6" />
        <!-- <Case :options="item" :serial-number="currentIndex + 1" :log-id="logId"
                v-if="item.topic_type === 7" :ref="`case-${item.id}`"
                :is-active="currentIndex === index && duration === 300" :type="type" @change="onCaseChange"
                @index-change="onCaseIndexChange" /> -->
      </swiper-item>
    </swiper>
    <!-- <AnswerBar class="bar" :model="model" :is-end="isEnd" :is-start="isStart" :time="time"
               :isCollection="!!getCurrentData.is_collection" @submit-paper="toTestResoult" @card="toCard"
               @next="handleNext" @prev="handlePrev" @collect="setCollection" @timeup="onTimeUp">
    </AnswerBar> -->
  </view>
</template>

<script>
import AnswerBar from "../components/answerBar";
import AnswerHead from "../components/answerHead";
import Single from "../components/single";
import Multiple from "../components/multiple";
import Judg from "../components/judg";
import Indefinite from "../components/indefinite";
import Completion from "../components/completion";
import Short from "../components/short";
import Case from "../components/case";

import {
  getPracticeAnswerSheet,
  getQuestionDetail
} from "@/api/question";

export default {
  name: "answer",
  components: {
    AnswerHead,
    AnswerBar,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    Case,
  },

  data() {
    return {
      // 当前的swiper 索引
      prevIndex: -1,
      currentIndex: 0,
      nextIndex: 1,
      duration: 300,

      model: '1',
      chapter_id: 0,
      last_question_id: 0,
      question_bank_id: 0,
      answer: {},
      question: {},
      userAnswer: '',
      total: 0,
      questionList: [],
      answerSheet: {},
      answerSheetArr: [],
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
    isRight() {
      return this.currentIndex > this.prevIndex
    },
  },
  watch: {
    currentIndex(val) {
      let question_id = this.answerSheetArr[val].id
      this.getQuestionDetail(question_id)
      this.getAnswerDetail(question_id)
    }
  },
  onShow() {
  },
  onLoad(query) {
    let { chapterId, question_bank_id, question_id, title = "章节练习" } = query
    this.chapter_id = +chapterId
    this.question_bank_id = +question_bank_id
    this.question_id = +question_id
    uni.setNavigationBarTitle({ title })
    this.getPracticeAnswerSheet()
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

    handlePrev() {
      if (!this.isStart) {
        this.prevIndex = this.currentIndex
        this.currentIndex = this.currentIndex - 1
      }
    },

    handleNext() {
      if (!this.isEnd) {
        this.prevIndex = this.currentIndex
        this.currentIndex = this.currentIndex + 1
      }
    },

    onSwiperChange({ detail }) {
      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }
      // let prevAnswer = this.getCurrAnswer(this.prevIndex)
      // let currAnswer = this.getCurrAnswer(this.currentIndex)      
      // if (this.isRight && prevAnswer) {
      //   this.submitAnswer(prevAnswer)
      // }
    },

    oonTouchmove() {
    },

    onAnimationfinish({ detail }) {
      // if (detail.current <= 0) {
      //   uni.showToast({ title: '已经是第一题了', icon: 'none' })
      // } else if (detail.current >= thiotal -1) {
      //   uni.showToast({ title: '已经是最后一题了', icon: 'none' })
      // }
    },

    getCurrAnswer(index) {
      let key = this.questionList[index].id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      console.log('cacheAnswer', answer);
      let key = answer.question_id
      this.userAnswerMap[key] = answer
    },

    async submitPaper() {
      let index = this.currentIndex
      let key = this.questionList[index].question_id
      let currAnswer = this.userAnswerMap[key]
      let data = { practice_id: this.practice_id, question_id: key, answer: currAnswer.answer }
      const res = await practiceAnswer(data);
      if (res.code === 0) {
        let url = `/pages/examinations/classTestMode/result/index`
        let query = `?practice_id=${this.practice_id}&lesson_id=${this.lesson_id}&grade=${80}`
        setTimeout(() => {
          uni.navigateTo({ url: url + query });
        }, 800);
      }
    },

    async submitAnswer(prevAnswer) {
      let data = { practice_id: this.practice_id, question_id: prevAnswer.question_id, answer: prevAnswer.answer }
      const res = await practiceAnswer(data);
    },

    getAnswerDetail(question_id) {
      this.userAnswer = this.userAnswerMap[question_id].amswer
    },

    async getQuestionDetail(question_id) {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_id: question_id, question_bank_id: questionBankInfo.id }
      let res = await getQuestionDetail(params)
      if (res.code === 0) {
        this.question = res.data
      }
    },

    async getPracticeAnswerSheet() {
      let params = { question_bank_id: this.question_bank_id, chapter_id: this.chapter_id }
      let res = await getPracticeAnswerSheet(params)
      if (res.code === 0) {
        let lastId = res.data.last_question_id
        let arr = res.data.arr
        if (!lastId) {
          lastId = arr[0].id
        }
        this.last_question_id = lastId
        this.answerSheetArr = arr
        this.total = arr.length
        this.answerSheet = res.data.list
        this.getQuestionDetail(lastId)
      }
    },
  }
}
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