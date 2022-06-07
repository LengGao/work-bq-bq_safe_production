<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :key="index" :value="item.id"
              :status="status(item.id)">
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
    correctAnswer: {
      type: [Array, String, Number],
      default: "",
    },
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      // 选中的答案
      checkedAnswer: this.value,
      selectLabel: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
      hasError: false,
    };
  },
  watch: {
    checkedAnswer(newValue, oldValue) {
      // console.log('newValue ', newValue);
      if (this.multiple) {
        this.$emit("change", newValue)
      } else if (newValue !== oldValue) {
        this.$emit("change", newValue)
      }
    },
  },
  
  methods: {
    status(value) {
      // console.log('checkedAnswe status',value, this.checkedAnswer, this.correctAnswer);
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
    onOptionChange(val) {
      // console.log('onOptionChange', val, this.checkedAnswer);
      if (this.model === 3 || (this.model === 1 && this.correctAnswer.length)) return;
      
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