<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :key="index"
              :value="item.id" :status="status(item.id)">
      <template v-slot:label>
         <text> {{ selectLabel[index] }}</text>
      </template>
    <u-parse :content="item.content" />
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
    noletter: {
      type: Boolean,
      default: false,
    },
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
    // 题目正确答案
    correctAnswer: {
      type: [Array, String, Number],
      default: "",
    },
  },
  data() {
    return {
      // 选中的答案
      checkedAnswer: this.value,
      selectLabel: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
    };
  },
  watch: {
    checkedAnswer(newValue, oldValue) {
      if (this.multiple) {
        this.$emit("input", newValue)
      } else if (newValue !== oldValue) {
        this.$emit("input", newValue)
      }
    },
  },
  methods: {
    status(value) {
      if (`${this.checkedAnswer}`.length) {
        console.log("status", this.checkedAnswer, "value", value);
        if (this.correctAnswer) {
          return this.correctAnswer.indexOf(`${value}`) !== -1 ? 'success' : 'error'             
        } else {
          if (this.multiple) {
            return this.checkedAnswer.indexOf(value) !== -1 ? 'active' : ''
          } else {
            return this.checkedAnswer === value ? 'active' : ''
          }
        }
      }
    },
    onOptionChange(val) {
      console.log('onOptionChange', val, this.checkedAnswer);
      if (this.multiple) {
        this.checkedAnswer.indexOf(val) !== -1 
        ? this.checkedAnswer = this.checkedAnswer.filter(item => item !== val)
        : this.checkedAnswer.push(val)
      } else {
        this.checkedAnswer = val
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>