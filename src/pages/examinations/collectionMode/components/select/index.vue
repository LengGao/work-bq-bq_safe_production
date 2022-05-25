<template>
  <view class="select">
    <s-option @change="onOptionChange" v-for="(item, index) in options" :key="item.id" 
      :value="item.id" :status="status(item.id)">
      <template v-slot:label>
        <text v-if="optionsType === 'select'"> {{ selectLabel[index] }}</text>
        <text v-else> {{ index }}</text>
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
    optionsType: {
      type: String,
      default: 'select'
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
  methods: {
    // 状态更新
    status(value) {
      if (this.multiple) {
        return this.checkedAnswer.includes(value) ? 'active' : ''
      } else {
        return value === this.checkedAnswer ? 'active' : ''
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