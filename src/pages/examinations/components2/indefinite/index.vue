<template>
  <div class="multiple">
    <view class="quetion-content">
      <u-parse :content="options.title" />
    </view>
    <Select :options="options.option" multiple :value="checkedAnswer" @change="onChangeOpt" />    

  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import Select from "../select";

export default {
  name: "indefinite",
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
    }
  },
  data() {
    return {
      checkedAnswer: []
    };
  },
  methods: {
    onChangeOpt(answer) {
      if (!(answer instanceof Array)) {
        answer = [answer]
      }
      let data = { id: this.options.id, question_id: this.options.question_id, answer: answer }
      this.$emit("change", data);
    }
  },
};
</script>
<style lang="scss" scoped>
.quetion-content {
  margin-bottom: 20rpx;
}
</style>