<template>
  <view class="single">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" :analysis="analysis" @change="onChangeOpt" />

    <AnswerAnalysis v-if="analysis && options.option.length" :question="options"/>
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
        title: "",
      })
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
      correctAnswer: '', // 保存已选择过的答案
      checkedAnswer: '', // 选中的答案
    };
  },
  mounted() {
    if (this.userAnswer && this.userAnswer.answer) {
      this.checkedAnswer = this.userAnswer.answer[0]
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right
      this.checkedAnswer = this.options.answer
    }
  },
  methods: {
    onChangeOpt(answer) {
      this.correctAnswer = answer
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