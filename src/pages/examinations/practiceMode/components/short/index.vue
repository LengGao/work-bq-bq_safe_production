<template>
  <div class="short">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <textarea :disabled="!!correctAnswer" class="text" @input="onInput" v-model="value" placeholder="请输入" />
    <AnswerEye @change="handleEyeChange" />
    <AnswerAnalysis v-if="correctAnswer" short :question="options" :userAnswer="value" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis";
import Select from "../select";
import AnswerEye from "../answerEye";
export default {
  name: "short",
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
      value: this.userAnswer || "",
    };
  },
  methods: {
    onInput() {
      let data = { id: this.options.id, answer: [this.value] }
      this.$emit("change", data);
    },
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.true_answer;
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
.text {
  width: 100%;
  box-sizing: border-box;
  border: $uni-border;
  padding: 24rpx;
  border-radius: 10rpx;
  margin-bottom: 20rpx;
}
</style>