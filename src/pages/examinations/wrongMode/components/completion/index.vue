<template>
  <view class="completion">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <i-option v-for="(item, index) in checkedAnswer" :key="index" :label="index + 1 + ''">
      <input type="text" v-model="item.value" placeholder="请输入" @input="onInput" />
    </i-option>

    <AnswerAnalysis v-if="analysis && correctAnswer" :user-answer="userAnswerText" :correct-answer="correctAnswer"
                :desc="options.topic_analysis" />
  </view>
</template>
<script>

import uParse from "@/components/gaoyia-parse/parse.vue";
import IOption from "../ioption";
import AnswerAnalysis from "../answerAnalysis/index";

export default {
  name: "completion",
  components: {
    IOption,
    uParse,
    AnswerAnalysis
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        title: "",
        option: [],
      }),
    },
    analysis: {
      type: Boolean,
      default: false
    },
    userAnswer: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      currectAnswer: "",
      checkedAnswer: []
    };
  },
  created() {
    if (this.userAnswer && this.userAnswer.answer) {
      this.checkedAnswer = this.userAnswer.answer.map(item => ({value: item}))
    } else {
      let len = this.options.option.length, list = []
      for (let i = 0; i < len; i++) {
        list[i] = { value: ''}
      }
      this.checkedAnswer = list
    }
  },
  methods: {
    onInput() {
      let answer = this.checkedAnswer.map(item => item.value)
      this.currectAnswer = answer
      let data = {id: this.options.id, question_id: this.options.question_id, answer: answer}
      this.$emit("change", data)
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>