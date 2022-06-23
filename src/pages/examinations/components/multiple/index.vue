<template>
  <div class="multiple">
    <view class="quetion-content">
      <!-- <u-parse :content="options.title" /> -->
      <view v-html="options.title"></view>
    </view>
    <Select :options="options.option" multiple :value="checkedAnswer" :model="model" :correct-answer="correctAnswer"
            @change="onChangeOpt" />
    <AnswerEye v-if="model !== 2" :correct-answer="correctAnswer" @change="handleEyeChange" />
    <AnswerAnalysis v-if="model !== 2 && correctAnswer" :question="options" :userAnswer="checkedAnswer" />
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
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: [],
    };
  },
  created() {
    if (this.model === 3) {
      this.checkedAnswer = this.options.user_answer.map(item => +item)
      this.correctAnswer = this.options.true_answer.map(item => +item)
    } else if (this.model === 2) {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer.map(item => +item)
      }
    } else {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer.map(item => +item)
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer.map(item => +item)
        } else {
          this.correctAnswer = this.options.option.map(item => item.is_right && +item.id).filter(item => !!item)
        }
      }
    }
  },
  methods: {
    handleEyeChange(val) {
      if (val) {
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer.map(item => +item);
        } else {
          this.correctAnswer = this.options.option.map(item => item.is_right && +item.id).filter(item => !!item)
        }
      } else {
        this.correctAnswer = "";
      }
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