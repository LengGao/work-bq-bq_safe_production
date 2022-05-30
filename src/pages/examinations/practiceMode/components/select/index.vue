<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :label="item.topic_option"
              :value="item.id" :key="index" :status="status(item.id)" :noletter="noletter">
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
      if (this.analysis) {
        return this.correctAnswer.indexOf(value) !== -1 ? 'success' : 'error'             
      } else {
        if (this.multiple) {
          return this.checkedAnswer.includes(value) ? 'active' : ''
        } else {
          return value === this.checkedAnswer ? 'active' : ''
        }
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