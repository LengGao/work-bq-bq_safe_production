<template>
  <view class="completion">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <i-option v-for="(item, index) in checkedAnswer" :key="index" :label="index + 1 + ''" :status="status(item.value)">
      <input type="text" :disabled="analysis" v-model="item.value" placeholder="请输入" @input="onInput" />
    </i-option>
    <AnswerAnalysis v-if="analysis" :question="options" />
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
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: []
    };
  },
  created() {
    if (this.analysis) {
      this.correctAnswer = this.options.right.map(item => item.trim())
      let right = this.options.right.map(item => item.trim())
      this.inputItem = this.options.option.map((item, index) => {
        return { value: right[index] || '', status: '' }
      })
    } else {
      this.inputItem = this.options.option.map((item, index) => {
        return { value: '', status: '' }
      })
    }
  },
  methods: {
    onInput() {
      let answer = this.checkedAnswer.map(item => item.value)
      this.checkedAnswer = answer
      let data = { question_id: this.options.question_id, answer: answer }
      this.$emit("change", data)
    },
    order() {
      let correctAnswer = this.correctAnswer, inputItem = this.inputItem
      inputItem.forEach((item, index, arr) => {
        if (arr[index].value === correctAnswer[index]) {
          item.status = "success"
        } else {
          item.status = "error"
        }
      })
    },
    status(value) {
      if (this.analysis) {
        this.order()
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>