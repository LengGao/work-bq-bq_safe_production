<template>
  <view class="short">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <textarea class="text" placeholder="请输入" :value="checkedAnswer" @input="onInput" />
    
    <AnswerAnalysis v-if="analysis && options.option.length" :question="options"/>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import Select from "../select/index";
import AnswerAnalysis from "../answerAnalysis/index";

export default {
  name: "short",
  components: {
    Select,
    uParse,
    AnswerAnalysis
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        title: '',
        option: [],
      }),
    },
    analysis: {
      type: Boolean,
      default: false
    },
    userAnswer: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: '',
    };
  },
  mounted() {
    if (this.userAnswer && this.userAnswer.answer) {
      this.checkedAnswer = this.userAnswer.answer
    }
    if (this.analysis) {
      this.correctAnswer = this.options.right
      this.checkedAnswer = this.options.answer[0]
    }
  },
  methods: {
    onInput({ detail }) {
      if (this.analysis) return;
      let data = {id: this.options.id, question_id: this.options.question_id, answer: [detail.value]}
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