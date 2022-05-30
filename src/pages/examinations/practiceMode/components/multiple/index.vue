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
      checkedAnswer: this.options.userAnswer || [],
      userAnswerText: "",
    };
  },
  watch: {
    checkedAnswer(val) {
      this.$emit("change", val, this.options.id);
    },
    model(val) {
      if (val === "3") {
        this.handleEyeChange(true);
      }
    },
  },
  created() {
    if (this.model === "3") {
      this.handleEyeChange(true);
    }
  },
  methods: {
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.topic_answer;
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