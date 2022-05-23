<template>
  <div class="completion">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <i-option v-for="(item, index) in inputItem" :key="index" :label="index + 1 + ''">
      <input type="text" v-model="item.value" placeholder="请输入" @blur="onInput" />
    </i-option>
  </div>
</template>
<script>

import uParse from "@/components/gaoyia-parse/parse.vue";
import IOption from "../ioption";

export default {
  name: "completion",
  components: {
    IOption,
    uParse,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        title: "",
        option: [],
      }),
    },
  },
  data() {
    return {
      sequence: true,
      correctAnswer: "",
      inputItem: []
    };
  },
  created() {
    let len = this.options.option.length, list = []
    for (let i = 0; i < len; i++) {
      list[i] = { value: ''}
    }
    this.inputItem = list
  },
  methods: {
    onInput() {
      let answer = this.inputItem.map(item => item.value)
      console.log(answer);
      let data = {id: options.id, question_id: options.question_id, answer: answer}
      this.$emit("change", data)
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>