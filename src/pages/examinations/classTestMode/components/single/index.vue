<template>
  <view class="single">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" :correct-answer="currectAnswer" @change="onChangeOpt" />
    
    <AnswerAnalysis v-if="analysis && correctAnswer" :user-answer="options.answer" :correct-answer="currectAnswer"
                :desc="options.analyse" />
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import Select from "../select/index";
import AnswerAnalysis from "../answerAnalysis/index";


export default {
  name: "single",
  components: {
    uParse,
    Select,
    AnswerAnalysis
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        option: [],
        title: "",
      }),
      analysis: {
        type: Boolean,
        default: false
      },
      userAnswer: {
        type: Object,
        default: () => ({})
      }
    },
  },
  data() {
    return {
      currectAnswer: '', // 保存已选择过的答案
      checkedAnswer: '', // 选中的答案
    };
  },
  mounted() {
    if (this.userAnswer && this.userAnswer.answer) {
      this.checkedAnswer = this.userAnswer.answer[0]
    }
    if (analysis) {
      this.currectAnswer()
    }
  },
  methods: {
    onChangeOpt(answer) {
      this.currectAnswer = answer
      let data = { id: this.options.id, question_id: this.options.question_id, answer: [answer] }
      this.$emit("change", data);
    }
  },
  correctAnswer() {
    this.currectAnswer = this.options.option.filter(item => {
      return item.is_right
    })
  }
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>