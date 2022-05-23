<template>
  <div class="judg">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" :value="checkedAnswer" @change="onChangeOpt" />
  </div>
</template>
<script>
import Select from "../select";
import uParse from "@/components/gaoyia-parse/parse.vue";

export default {
  name: "Judg",
  components: {
    Select,
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
      correctAnswer: "",
      checkedAnswer: ""
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