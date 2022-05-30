<template>
  <div class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" multiple v-model="checkedAnswer" :correct-answer="correctAnswer">
    </Select>
    <AnswerEye @change="handleEyeChange" />
    <AnswerAnalysis v-if="correctAnswer" :user-answer="userAnswerText" :correct-answer="correctAnswer"
                    :desc="options.analyse" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis";
import Select from "../select";
import AnswerEye from "../answerEye";

export default {
  name: "multiple",
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
        title: "",
        option: [],
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
      checkedAnswer: this.userAnswer || [],
      userAnswerText: "",
    };
  },
  watch: {
    checkedAnswer(val) {
      let data = { id: this.options.id, answer: [val] }
      this.$emit("change", data);
    },
  },
  created() {
  },
  methods: {
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.true_answer;
        this.userAnswerText = this.checkedAnswer.toString(",");
      } else {
        this.correctAnswer = "";
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