<template>
  <view class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" multiple
            :analysis="analysis" @change="onChangeOpt" />
    <AnswerAnalysis v-if="analysis" :question="options" />
  </view>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import Select from "../select";
import AnswerAnalysis from "../answerAnalysis/index";

export default {
  name: "indefinite",
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
    if (this.options.answer && this.options.answer.length) {
      this.checkedAnswer = this.options.answer.map(item => +item)
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right.map(item => +item)
      this.checkedAnswer = this.options.answer.map(item => +item)
    }
  },
  methods: {
    onChangeOpt(answer) {
      if (this.options.hasAnswer) { return; }
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