<template>
  <view class="select">
    <i-option @change="onOptionChange" v-for="(item, index) in options" :key="item.id" 
      :value="item.id" :status="status(item.id)">
      <template v-slot:label>
        <text v-if="optionsType === 'select'"> {{ selectLabel[index] }}</text>
        <text v-else> {{ index }}</text>
      </template>
      <u-parse :content="item.content" />
    </i-option>
  </view>
</template>
<script>
import IOption from "../option";
import uParse from "@/components/gaoyia-parse/parse.vue";
export default {
  name: "ISelect",
  components: {
    IOption,
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
  },
  data() {
    return {
      // 选中的答案
      checkedAnswer: this.value,
      selectLabel: ['A', 'B', 'C', 'D']
    };
  },
  watch: {
    checkedAnswer(newValue, oldValue) {
      if (this.multiple) {
        this.$emit("change", newValue);
        return;
      }
      if (newValue !== oldValue) {
        this.$emit("change", newValue);
      }
    },
  },
  methods: {
    // 状态更新
    status(value) {
      if (this.multiple) {
        return this.checkedAnswer.includes(val) ? 'active' : ''
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
      } else {
        this.simgleChoice(val)
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>