<template>
  <view class="answer-head">
    <view class="answer-head-title">{{ typeMap[type] }}</view>
    <view class="answer-head-number">{{ serialNumber }}/{{ total }}</view>
  </view>
</template>
<script>
export default {
  name: "answerHead", // 题目标题
  props: {
    type: {
      type: [String, Number],
      require: true,
    },
    total: {
      type: [String, Number],
      default: "",
    },
    serialNumber: {
      type: [String, Number],
      default: "",
    },
  },
  data() {
    return {
      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "判断题",
        4: "不定项题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
    };
  },
};
</script>
<style lang="scss" scoped>
.answer-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1rpx solid #dddddd;
  padding: 34rpx 0;
  margin: 0 40rpx;
  font-weight: bold;
  color: #199fff;
}
</style>