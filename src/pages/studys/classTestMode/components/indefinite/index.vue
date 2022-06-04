<template>
  <view class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" :multiple="true" :analysis="analysis" @change="onChangeOpt" />

    <AnswerAnalysis v-if="analysis && options.option.length" :question="options"/>
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
    userAnswer: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      correctAnswer: [],
      checkedAnswer: []
    };
  },
  mounted() {
    if (this.userAnswer && this.userAnswer.answer) {
      this.checkedAnswer = this.userAnswer.answer.map(item => item)
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right
      this.checkedAnswer = this.options.answer
    }
  },
  methods: {
    onChangeOpt(answer) {
      this.correctAnswer = answer
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