<template>
  <div class="judg">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" v-model="checkedAnswer" :correct-answer="correctAnswer">
    </Select>
    <AnswerAnalysis v-if="correctAnswer" :user-answer="checkedAnswer" :correct-answer="correctAnswer"
                    :desc="options.analyse" />
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
    userAnswer: {
      type: [Array, String, Number],
      default: "",
    },
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: this.userAnswer || "",
    };
  },
  watch: {
    checkedAnswer(val) {
      this.correctAnswer = this.options.true_answer;
      let data = { id: this.options.id, answer: [val] }
      this.$emit("change", data);
    },
  },
  created() {
    if (this.options.userAnswer) {
      this.correctAnswer = this.options.true_answer;
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>