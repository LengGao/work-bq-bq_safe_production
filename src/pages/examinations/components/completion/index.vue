<template>
  <div class="completion">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <IOption v-for="(item, index) in inputItem" :key="index" :label="index + 1 + ''" :status="item.status">
      <template v-slot:label>
        <text> {{ index + 1 }}</text>
      </template>
      <input type="text" class="input" :disabled="!!correctAnswer" v-model="item.value" placeholder="请输入"
             @blur="handlBlur" />
    </IOption>
    <AnswerEye v-if="model !== 2" :correct-answer="correctAnswer" @change="handleEyeChange" />
    <AnswerAnalysis v-if="model !== 2 && correctAnswer" :question="options" :userAnswer="checkedAnswer" />
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerAnalysis from "../answerAnalysis/index";
import Select from "../select/index";
import AnswerEye from "../answerEye/index";
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
    model: {
      type: Number,
      default: 1
    }
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
      console.log('val',val);
      if (val.length) {
        if (this.options.reorder) {
          this.disorder()
        } else {
          this.order()
        }
      } else {
        this.inputItem.forEach((item) => { item.status = ""})
      }
    },
  },
  created() {
    if (this.model === 3) {
      this.inputItem = this.options.option.map((item, index) => {
        return {value: this.options.user_answer[index] || '', status: '' }
      })
      this.correctAnswer = this.options.true_answer.map(item => item.trim())
    } else if (this.model === 2) {
      this.inputItem = this.options.option.map((item, index) => {
        return {value: this.options.user_answer[index] || '', status: '' }
      })
    } else {
      if (this.options.user_answer.length) {
        this.inputItem = this.options.option.map((item, index) => {
          return {value: this.options.user_answer[index].trim() || '', status: '' }
        })
        this.correctAnswer = this.options.true_answer.map(item => item.trim())
      } else {
        this.inputItem = this.options.option.map(item => ({ value: '', status: '' }))
      }
    }
  },
  methods: {
    handlBlur() {
      const vals = this.inputItem.map((item) => { item.value.trim(); return item.value })
      this.checkedAnswer = vals
      let data = { id: this.options.id, answer: vals }
      this.$emit("change", data)
    },
    order() {
      let correctAnswer = this.correctAnswer, inputItem = this.inputItem
      inputItem.forEach((item, index, arr) => {
        console.log(arr[index], correctAnswer[index] );
        if (arr[index].value === correctAnswer[index]) {
          item.status = "success"
        } else {
          item.status = "error"
        }
      })
    },
    disorder() {
      let correctAnswer = this.correctAnswer, inputItem = this.inputItem, cache = {}
      inputItem.forEach((item) => {
        let val = item.value.trim()
        if (correctAnswer.includes(val)) {
          if (!cache[val]) {
            item.status = "success"
            cache[val] = true
          } else {
            item.status = "omission"
          }
        } else {
          item.status = "error"
        }
      })
    },

    handleEyeChange(val) {
      if (val) {
        this.correctAnswer = this.options.true_answer.map(item => item.trim())
      } else {
        this.correctAnswer = "";
        // this.inputItem.forEach((item) => { item.status = ""})
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}

.input {
  font-size: 28rpx;
  line-height: 100%;
  width: 100%;
}
</style>