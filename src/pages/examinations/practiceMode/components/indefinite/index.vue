<template>
  <div class="indefinite">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" multiple :value="checkedAnswer" :correct-answer="correctAnswer" @change="onChangeOpt" />
    <AnswerEye :correctAnswer="correctAnswer" @change="handleEyeChange" />
    <AnswerAnalysis v-if="correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis";
import Select from "../select";
import AnswerEye from "../answerEye";

export default {
  name: "indefinite",
  components: {
    AnswerAnalysis,
    Select,
    AnswerEye,
    uParse,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        option: [],
        title: "",
      }),
    },
    userAnswer: {
      type: [Array, String, Number],
      default: "",
    },
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: [],
    };
  },
  created() {
    if (this.options.userAnswer.langth) {
      this.correctAnswer = this.options.true_answer.map(item => +item)
      this.checkedAnswer = this.options.user_answer.map(item => +item)
    }
  },
  methods: {
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.true_answer.map(item => +item);
      } else {
        this.correctAnswer = "";
      }
    },
    onChangeOpt(val) {
      console.log('indefinite', val);
      let data = { id: this.options.id, answer: val }
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