<template>
  <view class="single">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :analysis="analysis" :correct-answer="correctAnswer" @change="onChangeOpt" />
    <AnswerAnalysis v-if="analysis" :question="options" />
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import Select from "../select/index";
import AnswerAnalysis from "../answerAnalysis/index";


export default {
  name: "single",
  components: {
    uParse,
    Select,
    AnswerAnalysis
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        option: [],
        title: ""
      })
    },
    analysis: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      correctAnswer: '',
      checkedAnswer: '',
    };
  },
  created() {
    if (this.options.answer.length) {
      this.checkedAnswer = this.options.answer.map(item => +item)[0]
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right.map(item => +item)
      this.checkedAnswer = this.options.answer.map(item => +item)[0]
    }
  },
  methods: {
    onChangeOpt(answer) {
      this.checkedAnswer = answer
      let data = { id: this.options.id, question_id: this.options.question_id, answer: [answer] }
      this.$emit("change", data);
    },
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>