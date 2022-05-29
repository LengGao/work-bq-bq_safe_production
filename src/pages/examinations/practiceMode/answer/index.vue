<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].topic_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.topic_type === 7 }"
                   v-for="(item, index) in questionList" :key="index">
          <Single :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 1" />
          <Multiple :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 2" />
          <Judg :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 3" />
          <Indefinite :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 4" />
          <Completion :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 5" />
          <Short :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 6" />
          <Case :model="model" :options="item" :serial-number="currentIndex + 1" :log-id="logId"
                v-if="item.topic_type === 7" :ref="`case-${item.id}`"
                :is-active="currentIndex === index && duration === 300" :type="type" @change="onCaseChange"
                @index-change="onCaseIndexChange" />
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" :model="model" :is-end="isEnd" :is-start="isStart" :time="time"
               :isCollection="!!getCurrentData.is_collection" @submit-paper="toTestResoult" @card="toCard"
               @next="handleNext" @prev="handlePrev" @collect="setCollection" @timeup="onTimeUp">
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
      disableTouch: true,
      duration: 300,

      model: '1',
      chapter_id: 0,
      last_question_id: 0,
      question_bank_id: 0,
      question: {},
      total: 0,
      questionList: [],
      answerSheet: {},
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
    }
  },
  onShow() {
    this.duration = 300;
  },
  onLoad(query) {
    // isContinue 是否为继续做题
    let { chapterId, question_bank_id, question_id, title = "章节练习" } = query
    this.chapter_id = +chapterId
    this.question_bank_id = +question_bank_id
    this.question_id = +question_id
    uni.setNavigationBarTitle({ title })
    this.getPracticeAnswerSheet()
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

    onMultipleChange() {

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
      console.log(this.isRight, prevAnswer, currAnswer, this.prevIndex, this.currentIndex, detail);
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
    },

    onAnimationfinish({ detail }) {
      console.log('detail', detail);
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
        let data = { practice_id: this.practice_id, question_id: key, answer: currAnswer.answer }
        const res = await practiceAnswer(data);
        if (res.code === 0) {
          let url = `/pages/examinations/classTestMode/result/index`
          let query = `?practice_id=${this.practice_id}&lesson_id=${this.lesson_id}&grade=${80}`
          setTimeout(() => {
            uni.navigateTo({ url: url + query });
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
        this.duration = 0;
        this.disableTouch = true
      }
    },

    async getQuestionDetail(question_id) {
      let params = { question_id}
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
        if (!lastId) {
          lastId =  res.data.arr[0].id
        }
        this.last_question_id = lastId
        this.total = res.data.arr.length
        this.questionList = res.data.arr
        this.answerSheet = res.data.list
        this.getQuestionDetail(lastId)
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