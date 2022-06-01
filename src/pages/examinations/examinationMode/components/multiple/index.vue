<template>
  <div class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" multiple :value="checkedAnswer" :correct-answer="correctAnswer"
            @change="onChangeOpt" />
    <!-- <AnswerEye :correct-answer="correctAnswer" @change="handleEyeChange" /> -->
    <AnswerAnalysis v-if="correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis/index";
import Select from "../select/index";
import AnswerEye from "../answerEye/index";

export default {
  name: "multiple",
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
        title: "",
        option: [],
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
      checkedAnswer: [],
    };
  },
  created() {
    // if (this.options.user_answer.length) {
    //   this.correctAnswer = this.options.true_answer.map(item => +item)
    //   this.checkedAnswer = this.options.user_answer.map(item => +item)
    // }
  },
  methods: {
    handleEyeChange(val) {
      // if (val) {
      //   this.correctAnswer = this.options.true_answer.map(item => +item)
      // } else {
      //   this.correctAnswer = "";
      // }
    },
    onChangeOpt(val) {
      // console.log('multiple', val);
      this.checkedAnswer = val
      let data = { id: this.options.id, answer: val }
      this.$emit("change", data);
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>