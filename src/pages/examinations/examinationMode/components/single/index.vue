<template>
  <div class="single">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="correctAnswer" @change="onChangeOpt"  />
    <AnswerAnalysis v-if="isAnalysis && correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis/index.vue";
import Select from "../select/index";

export default {
  name: "single",
  components: {
    AnswerAnalysis,
    uParse,
    Select,
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
    userAnswer: {
      type: [Array, String, Number],
      default: "",
    },
  },
  data() {
    return {
      correctAnswer: '',
      checkedAnswer: '',
    };
  },
  created() {
    if (this.options.user_answer.length) {
    //   this.correctAnswer = this.options.true_answer.map(item => +item)
      this.checkedAnswer = this.options.user_answer.map(item => +item)[0]
    //   console.log("single", this.options.user_answer, this.checkedAnswer)
    } else if (this.isAnalysis) {
      this.correctAnswer = this.options.true_answer.map(item => +item)
    }
  },
  methods: {
    onChangeOpt(val) {
        // console.log('single onChangeOpt', val);
        this.checkedAnswer = val
        // this.correctAnswer = this.options.true_answer.map(item => +item)
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