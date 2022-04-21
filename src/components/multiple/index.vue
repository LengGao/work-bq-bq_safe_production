<template>
  <div class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.topic_description" />
    </view>
    <Select :options="options.option" multiple v-model="checkedAnswer" :correct-answer="correctAnswer">
    </Select>
    <AnswerEye @change="handleEyeChange" v-if="model === '1'" />
    <AnswerAnalysis v-if="correctAnswer" :user-answer="userAnswerText" :correct-answer="correctAnswer"
                    :desc="options.topic_analysis" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "@/components/answerAnalysis";
import Select from "@/components/select";
import AnswerEye from "@/components/answerEye";

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
        option: [],
        topic_description: "",
      }),
    },
    model: {
      type: String,
      default: "1",
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