<template>
  <div class="judg">
    <view class="quetion-content">
      <!-- <u-parse :content="options.title" /> -->
      <view v-html="options.title"></view>
    </view>
    <Select :options="options.option" :value="checkedAnswer" :model="model" :correct-answer="correctAnswer"  @change="onChangeOpt" />
    <AnswerAnalysis v-if="correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis/index";
import Select from "../select/index";

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
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      correctAnswer: "",
      checkedAnswer: "",
    };
  },
  created() {
    if (this.model === 3) {
      this.checkedAnswer = this.options.user_answer.map(item => +item)[0] 
      this.correctAnswer = this.options.true_answer.map(item => +item)
    } else if (this.model === 2) {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer.map(item => +item)[0]
      }
    } else {
      if (this.options.user_answer.length) {
        this.checkedAnswer = this.options.user_answer.map(item => +item)[0]
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer.map(item => +item)
        } else {
          this.correctAnswer = this.options.option.map(item => item.is_right && +item.id).filter(item => !!item)
        }
      }
    }
  },
  methods: {
    onChangeOpt(val) {
      // console.log('judg', val);
      if (val && this.model === 1) {
        if (this.options.true_answer) {
          this.correctAnswer = this.options.true_answer.map(item => +item);
        } else {
          this.correctAnswer = this.options.option.map(item => item.is_right && +item.id).filter(item => !!item)
        }
      }
      this.checkedAnswer = val
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