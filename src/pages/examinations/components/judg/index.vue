<template>
  <div class="judg">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" v-model="checkedAnswer" :correct-answer="correctAnswer">
    </Select>
    <AnswerAnalysis v-if="correctAnswer" :user-answer="checkedAnswer" :correct-answer="correctAnswer"
                    :desc="options.topic_analysis" />
  </div>
</template>
<script>
import AnswerAnalysis from "../answerAnalysis";
import Select from "../select";
import uParse from "@/components/gaoyia-parse/parse.vue";
export default {
  name: "Judg",
  components: {
    AnswerAnalysis,
    Select,
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
    model: {
      type: String,
      default: "1",
    },
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: this.options.userAnswer || "",
    };
  },
  watch: {
    checkedAnswer(val) {
      if (this.model === "1") {
        this.correctAnswer = this.options.topic_answer;
      }
      this.$emit("change", val, this.options.id);
    },
    model() {
      if (this.model === "3") {
        this.correctAnswer = this.options.topic_answer;
      }
    },
  },
  created() {
    if (this.options.userAnswer && this.model === "1") {
      this.correctAnswer = this.options.topic_answer;
    }
    if (this.model === "3") {
      this.correctAnswer = this.options.topic_answer;
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>