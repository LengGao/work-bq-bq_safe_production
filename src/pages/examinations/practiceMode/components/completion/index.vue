<template>
  <div class="completion">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <IOption v-for="(item, index) in inputItem" :key="index" :label="index + 1 + ''" :status="item.status">
      <template v-slot:label>
         <text> {{ index + 1 }}</text>
      </template>
      <input type="text" :disabled="!!correctAnswer" v-model="item.value" placeholder="请输入" @blur="handlBlur" />
    </IOption>
    <AnswerEye @change="handleEyeChange" />
    <AnswerAnalysis v-if="correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis";
import Select from "../select";
import AnswerEye from "../answerEye";
import IOption from "../ioption";
export default {
  name: "completion",
  components: {
    AnswerAnalysis,
    Select,
    AnswerEye,
    IOption,
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
      sequence: true,
      correctAnswer: "",
      checkedAnswer: '',
      inputItem: [],
    };
  },
  watch: {
    correctAnswer(val) {
      if (val.length) {
        let list = this.inputItem
        for(let i = 0, ii = list.length; i < ii; i++) {
          let item = list[i]
          if (item.value.trim() === val[i].trim()) {
            item.status = 'success'
          } else {
            item.status = 'error'
          }
        }
      } else {
        this.inputItem.forEach((item) => {
          item.status = ''
        })
      }
    },
  },
  mounted() {
    if (this.userAnswer) {
      this.inputItem = this.options.option.map((item, index) => {
        return { id: item.id, value: this.userAnswer[index] || '', status: ''}
      })
    } else {
      this.inputItem = this.options.option.map(item => ({ id: item.id, value: '', status: ''}))
    }
  },
  methods: {
    handlBlur() {
      const vals = this.inputItem.map((item) => {
        item.value.trim()
        return item.value
      });
      this.checkedAnswer = vals
      let data = { id: this.options.id, answer: vals }
      this.$emit("change", data);
    },
    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.true_answer
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
</style>