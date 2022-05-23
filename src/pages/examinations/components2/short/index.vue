<template>
  <div class="short">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <textarea class="text" placeholder="请输入" :value="checkedAnswer" @blur="onInput" />
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
        title: '',
        option: [],
      }),
    },
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: '',
    };
  },
  methods: {
    onInput({ detail }) {
      let data = {id: options.id, question_id: options.question_id, answer: [detail.value]}
      this.$emit("change", data)
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