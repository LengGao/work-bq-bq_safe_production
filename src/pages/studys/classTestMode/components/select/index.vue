<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :key="item.id" 
      :value="item.id" :status="status(item.id)">
      <template v-slot:label>
        <text> {{ selectLabel[index] }}</text>
      </template>
      <!-- <u-parse :content="item.content" /> -->
      <view v-html="item.content || '无'"></view>
    </s-option>
  </view>
</template>

<script>
import SOption from "../soption";
import uParse from "@/components/gaoyia-parse/parse.vue";

export default {
  name: "ISelect",
  components: {
    SOption,
    uParse,
  },
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
    value: {
      type: [Array, String, Number],
      default: "",
    },
    options: {
      type: Array,
      default: () => [],
    },
    correctAnswer: {
      type: [Array, String, Number],
      default: "",
    },
    analysis: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      // 选中的答案
      checkedAnswer: this.value,
      selectLabel: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      hasError: false
    };
  },
  methods: {
    // 状态更新
    status(value) {
      if (this.multiple) {
        if (this.correctAnswer.length) {
          let res = ''
          if (this.correctAnswer.includes(value)) {
            res = "success";
          }
          if (this.checkedAnswer.includes(value) && !this.correctAnswer.includes(value)) {
            this.hasError = true
            res = "error";
          }
          if (this.correctAnswer.includes(value) && !this.checkedAnswer.includes(value)) {
            res = this.hasError ? 'success' : 'omission'
          }
          return res 
        }

        if (this.checkedAnswer.includes(value)) {
          return "active";
        }
        return "";
      } else {
        if (this.correctAnswer) {
          if (this.correctAnswer == value) {
            return "success";
          }
          if (value != this.correctAnswer && this.checkedAnswer == value) {
            return "error";
          }
        }
        if (this.checkedAnswer == value) {
          return "active";
        }
        return "";
      }
    },
    // 多选
    multipleChoice(val) {
      if (this.checkedAnswer.includes(val)) {
        this.checkedAnswer = this.checkedAnswer.filter((item) => item !== val);
      } else {
        this.checkedAnswer.push(val);
      }
    },
    // 单选
    simgleChoice(val) {
      this.checkedAnswer = val;
    },
    // 单选 多选
    onOptionChange(val) {
      if (this.analysis ) return;
      if (this.multiple) {
        this.multipleChoice(val)
        this.$emit("change", this.checkedAnswer);
      } else{
        this.simgleChoice(val)
        this.$emit("change", this.checkedAnswer);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>