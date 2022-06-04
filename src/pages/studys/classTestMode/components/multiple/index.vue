<template>
  <view class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" multiple
            @change="onChangeOpt" />
    <AnswerAnalysis v-if="analysis" :question="options" />
  </view>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse";
import Select from "../select/index";
import AnswerAnalysis from "../answerAnalysis/index";

export default {
  name: "multiple",
  components: {
    Select,
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
      correctAnswer: [],
      checkedAnswer: []
    };
  },
  created() {
    if (this.options.answer.length) {
      this.checkedAnswer = this.options.answer
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right.map(item => +item)
      this.checkedAnswer = this.options.answer
    }
  },
  methods: {
    onChangeOpt(answer) {
      this.checkedAnswer = answer
      let data = { id: this.options.id, question_id: this.options.question_id, answer: answer }
      this.$emit("change", data);
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>