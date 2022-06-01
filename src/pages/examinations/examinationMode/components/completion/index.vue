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
             <!-- @confirm -->
    </IOption>
    <!-- <AnswerEye :correct-answer="correctAnswer" @change="handleEyeChange" />
    <AnswerAnalysis v-if="correctAnswer" :question="options" :userAnswer="checkedAnswer" /> -->
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
    // correctAnswer(val) {
      // console.log(val);
    //   if (val.length) {
    //     if (this.reorder) {
    //       let map = {}
    //       this.inputItem.forEach((item, index) => {
    //         if (val.includes(item.value)) {
    //           if (!map[item.value]) {
    //             item.status = "success";
    //             map[item.value] = true
    //           }
    //         } else {
    //           item.status = "error";
    //         }
    //       });
    //     } else {
    //       let list = this.inputItem
    //       for (let i = 0, ii = list.length; i < ii; i++) {
    //         let item = list[i]
    //         if (item.value.trim() === val[i].trim()) {
    //           item.status = 'success'
    //         } else {
    //           item.status = 'error'
    //         }
    //       }
    //     }
    //   } else {
    //     this.inputItem.forEach((item) => {
    //       item.status = ''
    //     })
    //   }
    // },
  },
  created() {
    // if (this.options.user_answer.length) {
    //   this.inputItem = this.options.option.map((item, index) => {
    //     return {value: this.options.user_answer[index] || '', status: '' }
    //   })
    //   this.correctAnswer = this.options.true_answer
    // } else {
      this.inputItem = this.options.option.map(item => ({ value: '', status: '' }))
    // }
  },
  methods: {
    handlBlur() {
      const vals = this.inputItem.map((item) => { item.value.trim(); return item.value })
      // console.log("completion", vals);
      this.checkedAnswer = vals
      let data = { id: this.options.id, answer: vals }
      this.$emit("change", data);
    },
    handleEyeChange(val) {
      // if (val) {
      //   this.correctAnswer = this.options.true_answer
      // } else {
      //   this.correctAnswer = "";
      // }
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