<template>
  <div class="short">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <!-- confirm="onInput -->
    <textarea :disabled="!!correctAnswer" class="text" @blur="onInput" :value="value" placeholder="请输入" />
    <!-- <AnswerEye :correctAnswer="correctAnswer" @change="handleEyeChange" /> -->
    <AnswerAnalysis v-if="isAnalysis && correctAnswer" short :question="options" :userAnswer="value" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis/index.vue";
import Select from "../select/index";
import AnswerEye from "../answerEye/index.vue";

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
    isAnalysis: {
      type: Boolean,
      default: false,
    },
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      correctAnswer: "",
      value: "",
    };
  },
  created() {
    if (this.options.user_answer.length) {
      this.value = this.options.user_answer[0]
    }

    if (this.isAnalysis) {
      this.correctAnswer = this.options.true_answer
      this.checkedAnswer = this.options.user_answer
    }
  },
  methods: {
    onInput({ detail }) {
      // console.log("short", detail);
      this.value = detail.value
      let data = { id: this.options.id, answer: this.value }
      this.$emit("change", data);
    },
    handleEyeChange(val) {
      // if (val) {
      //   this.correctAnswer = this.options.true_answer;
      // } else {
      //   this.correctAnswer = "";
      // }
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