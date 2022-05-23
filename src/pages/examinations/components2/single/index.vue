<template>
  <div class="single">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" @change="onChangeOpt" />

  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import Select from "../select/index";

export default {
  name: "single",
  components: {
    uParse,
    Select,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        option: [],
        title: "",
      }),
    },
  },
  data() {
    return {
      checkedAnswer: "", // 选中的答案
    };
  },
  methods: {
    onChangeOpt(answer) {
      let data = { id: this.options.id, question_id: this.options.question_id, answer: [answer] }
      this.$emit("change", data);
    }
  }
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>