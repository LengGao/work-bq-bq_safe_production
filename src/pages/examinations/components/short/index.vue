<template>
  <div class="short">
    <view class="quetion-content">
      <!-- <u-parse :content="options.title" /> -->
      <view v-html="options.title"></view>
    </view>
    <textarea :disabled="!!correctAnswer" class="text" @input="onInput" :value="checkedAnswer" placeholder="请输入" />
    <AnswerEye v-if="model !== 2" :correctAnswer="correctAnswer" @change="handleEyeChange" />
    <AnswerAnalysis v-if="model !== 2 && correctAnswer" short :question="options" :userAnswer="checkedAnswer" />
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
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: "",
      timer: 0,
    };
  },
  created() {
    if (this.model === 3) {
      this.checkedAnswer = this.options.user_answer[0]
      this.correctAnswer = this.options.true_answer
    } else if (this.model === 2) {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer[0]
      }
    } else {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer[0]
        this.correctAnswer = this.options.true_answer
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer
        } else {
          this.correctAnswer = this.options.option[0].content
        }
      }
    }
  },
  methods: {
    onInput({ detail }) {
      // console.log('detail', detail);
      this.checkedAnswer = detail.value
      let data = { id: this.options.id, answer: detail.value }
      this.$emit("change", data);
    },
    handleEyeChange(val) {
      if (val) {
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer
        } else {
          this.correctAnswer = this.options.option[0].content
        }
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