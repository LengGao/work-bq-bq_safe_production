<template>
  <div class="judg">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" @change="onChangeOpt" />
    <AnswerAnalysis v-if="checkedAnswer && correctAnswer" :question="options" :userAnswer="checkedAnswer" />
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
      checkedAnswer: "",
    };
  },
  created() {
    if (this.options.user_answer.length) {
      this.correctAnswer = this.options.true_answer.map(item => +item);
      this.checkedAnswer = this.options.user_answer.map(item => +item)
    }
  },
  methods: {
    onChangeOptval() {
      console.log('judg', val);
      this.correctAnswer = this.options.true_answer.map(item => +item);
      let data = { id: this.options.id, answer: [val] }
      this.$emit("change", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>