<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].question_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex" :disable-touch="false"
            @animationfinish="onAnimationfinish">

      <swiper-item class="swiper-item"
                   :class="{ 'swiper-item--hidden': questionList[currentIndex] && questionList[currentIndex].question_type === 7 }"
                   v-for="(item, index) in answerSheetArr" :key="index">
        <!-- <template v-if="currentIndex === index || (currentIndex - 1) === index || (currentIndex + 1) === index"> -->
        <Single :options="questionList[index]" @change="onSingleChange"
                v-if="questionList[index] && questionList[index].question_type === 1" />
        <Multiple :options="questionList[index]" @change="onSingleChange"
                  v-if="questionList[index] && questionList[index].question_type === 2" />
        <Indefinite :options="questionList[index]" @change="onSingleChange"
                    v-if="questionList[index] && questionList[index].question_type === 3" />
        <Judg :options="questionList[index]" @change="onSingleChange"
              v-if="questionList[index] && questionList[index].question_type === 4" />
        <Completion :options="questionList[index]" @change="onInputChange"
                    v-if="questionList[index] && questionList[index].question_type === 5" />
        <Short :options="questionList[index]" @change="onInputChange"
               v-if="questionList[index] && questionList[index].question_type === 6" />
        <Case :options="questionList[index]" :serial-number="currentIndex + 1" :log-id="logId"
              v-if="questionList[index] && questionList[index].question_type === 7" :ref="`case-${item.id}`"
              @change="onCaseChange" @index-change="onCaseIndexChange" />
        <!-- </template> -->
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" :is-end="isEnd" :is-start="isStart" @submit-paper="toTestResoult" @card="toCard"
               @next="handleNext" @prev="handlePrev" @collect="setCollection">
    </AnswerBar>
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
  getQuestionDetail,
  practiceAnswerTheQuestion,
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
      prevIndex: -1,
      currentIndex: 0,
      nextIndex: 1,
      duration: 300,

      chapter_id: 0,
      last_question_id: 0,
      question_bank_id: 0,

      caseIndex: 0,
      logId: '',

      answer: {},
      questionList: [],
      question: {},
      total: 0,
      userAnswer: '',
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
    isCollection() {
      return this.question.is_collect
    }
  },
  watch: {
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

    prevfetch() {
      let index = 0
      if (this.isRight) {
        index = this.currentIndex + 1
      } else {
        index = this.currentIndex - 1
      }
      if (index > this.total - 1 || index < 0) return;

      let inAnswerSheet = this.answerSheetArr[index]
      let inQuestionList = this.questionList[index]

      if (inAnswerSheet && !inQuestionList) {
        let question_id = inAnswerSheet.id
        this.getQuestionDetail(question_id, index)
      }
    },


    onSwiperChange({ detail }) {
      if (detail.source === 'touch') {
        this.prevIndex = this.currentIndex
        this.currentIndex = detail.current
      }
      if (detail.current <= 0) {
        uni.showToast({ title: '已经是第一题了', icon: 'none' })
      } else if (detail.current >= this.total - 1) {
        uni.showToast({ title: '已经是最后一题了', icon: 'none' })
      }
      this.prevfetch()
      this.submitAnswer()
    },

    onAnimationfinish({ detail }) {

    },


    onCaseIndexChange(index) {
      this.caseIndex = index;
    },

    onCaseChange(index, answer) {
      this.questionList[this.currentIndex].child[index].userAnswer = answer;
    },

    getCurrAnswer(index) {
      let key = this.questionList[index].id
      return this.userAnswerMap[key]
    },

    cacheAnswer(answer) {
      let key = answer.id
      if (!this.userAnswerMap[key]) {
        this.userAnswerMap[key] = answer
      }
      console.log('cacheAnswer', answer, this.userAnswerMap);
    },

    getAnswerDetail(question_id) {
      let userAnswer = this.userAnswerMap[question_id]
      this.userAnswer = userAnswer ? userAnswer.answer : ''
      console.log('getAnswerDetail', userAnswer);
    },

    async toCard() {

    },

    async setCollection() {

    },

    async submitPaper() {
      let index = this.currentIndex
      let key = this.questionList[index].id
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

    async submitAnswer() {
      let answer = this.getCurrAnswer(this.prevIndex)
      console.log('answer', answer);
      if (answer) {
        let questionBankInfo = this.$store.getters.questionBankInfo
        let data = { question_bank_id: questionBankInfo.id, question_id: answer.id, user_answer: answer.answer }
        const res = await practiceAnswerTheQuestion(data);
        if (res.code === 0) {
        }
      }
    },

    async getQuestionDetail(question_id, index) {
      console.log(index, this.currentIndex);
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_id: question_id, question_bank_id: questionBankInfo.id }
      let res = await getQuestionDetail(params)
      if (res.code === 0) {
        this.questionList[index] = res.data
      }
    },

    async getPracticeAnswerSheet() {
      let params = { question_bank_id: this.question_bank_id, chapter_id: this.chapter_id }
      let res = await getPracticeAnswerSheet(params)
      if (res.code === 0) {
        let lastId = res.data.last_question_id
        let arr = res.data.arr
        let total = arr.length
        let prev = 0
        let curr = 0
        let next = 0
        if (!lastId) lastId = arr[0].id;

        let index = arr.findIndex(item => item.id === lastId)

        if (index === -1) {
          prev = arr[0].id
          curr = arr[1].id
          next = arr[2].id
        } else if (index === 0) {
          prev = arr[index].id
          curr = arr[index + 1].id
          next = arr[index + 2].id
        } else if (index === total - 1) {
          prev = arr[index - 2].id
          curr = arr[index - 1].id
          next = arr[index].id
        } else {
          prev = arr[index - 1].id
          curr = arr[index].id
          next = arr[index + 1].id
        }

        this.last_question_id = lastId
        this.answerSheetArr = arr
        this.total = total
        this.currentIndex = (index !== -1 ? index : 0)
        this.answerSheet = res.data.list
        this.initQuestion(prev, curr, next)
      }
    },


    async initQuestion(prev, curr, next) {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params1 = { question_bank_id: questionBankInfo.id, question_id: prev }
      let params2 = { question_bank_id: questionBankInfo.id, question_id: curr }
      let params3 = { question_bank_id: questionBankInfo.id, question_id: next }
      let res = await Promise.all([getQuestionDetail(params1), getQuestionDetail(params2), getQuestionDetail(params3)])
      if (res.length) {
        let list = res.map(item => item.data)
        this.fiilQuestion(list)
      }
    },

    fiilQuestion(list) {
      let arr = [].fill({}, 0, this.answerSheetArr.length), index = this.currentIndex
      if (index === 0) {
        arr[index] = list[0]
        arr[index + 1] = list[1]
        arr[index + 2] = list[2]
      } else if (index === this.total - 1) {
        arr[index - 2] = list[0]
        arr[index - 1] = list[1]
        arr[index] = list[2]
      } else {
        arr[index - 1] = list[0]
        arr[index] = list[1]
        arr[index + 1] = list[2]
      }

      this.questionList = JSON.parse(JSON.stringify(arr))
    },

    async initAnswer(pre, curr, prv) {

    }

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