<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :key="item.id" 
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
    };
  },
  methods: {
    // 状态更新
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
      if (this.analysis) return;
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