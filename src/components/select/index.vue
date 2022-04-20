<template>
  <view class="select">
    <i-option @change="onOptionChange" v-for="(item, index) in options" :label="item.topic_option"
              :value="item.topic_option" :key="index" :status="status(item.topic_option)" :noletter="noletter">
      <u-parse :content="item.topic_option_description" />
    </i-option>
  </view>
</template>
<script>
import IOption from "../option";
import uParse from "@/components/gaoyia-parse/parse.vue";
export default {
  name: "select",
  components: {
    IOption,
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
    };
  },

  watch: {
    checkedAnswer(newValue, oldValue) {
      if (this.multiple) {
        this.$emit("input", newValue);
        return;
      }
      if (newValue !== oldValue) {
        this.$emit("input", newValue);
      }
    },
  },
  methods: {
    status(value) {
      if (this.multiple) {
        if (this.correctAnswer.length) {
          if (this.correctAnswer.includes(value)) {
            return "success";
          }
          if (
            this.checkedAnswer.includes(value) &&
            !this.correctAnswer.includes(value)
          ) {
            return "error";
          }
        }
        if (this.checkedAnswer.includes(value)) {
          return "active";
        }
        return "";
      } else {
        // 单选下的状态
        if (this.correctAnswer) {
          if (value == this.correctAnswer) {
            return "success";
          }
          if (value != this.correctAnswer && this.checkedAnswer === value) {
            return "error";
          }
        }
        if (value === this.checkedAnswer) {
          return "active";
        }
        return "";
      }
    },
    onOptionChange(val) {
      // 多选
      if (this.multiple) {
        if (!this.correctAnswer.length) {
          //已经选了就去掉
          if (this.checkedAnswer.includes(val)) {
            this.checkedAnswer = this.checkedAnswer.filter(
              (item) => item !== val
            );
          } else {
            this.checkedAnswer.push(val);
          }
        } else {
          // uni.showToast({
          //   icon: "none",
          //   title: "已经答过了",
          // });
        }
      } else {
        //单选
        if (!this.correctAnswer) {
          this.checkedAnswer = val;
        } else {
          // uni.showToast({
          //   icon: "none",
          //   title: "已经答过了",
          // });
        }
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>