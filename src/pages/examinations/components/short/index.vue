<template>
  <div class="short">
    <view class="quetion-content">
      <u-parse :content="options.topic_description" />
    </view>
    <textarea :disabled="!!correctAnswer" class="text" @input="onInput" v-model="value" placeholder="请输入" />
    <AnswerEye @change="handleEyeChange" v-if="model === '1'" />
    <AnswerAnalysis short v-if="correctAnswer" :desc="correctAnswer" />
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
      value: this.options.userAnswer || "",
    };
  },
  watch: {
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
    onInput() {
      this.$emit("change", [this.value], this.options.id);
    },
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.topic_answer;
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