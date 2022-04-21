<template>
  <view class="header">
    <block v-if="model === '1' || model === '3'">
      <view class="status status--success">正确</view>
      <view class="status status--error">错误</view>
      <view class="status status--none">未回答</view>
    </block>
    <block v-if="model === '2'">
      <view class="status status--primary">已回答</view>
      <view class="status status--none">未回答</view>
    </block>
  </view>
</template>
<script>
export default {
  name: "IHeader",
  props: {
    model: {
      type: String,
      default: "primary",
    },
  },
};
</script>
<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  padding: 20rpx;
  border-bottom: $uni-border;
  .status {
    width: calc(100% / 3);
    display: flex;
    align-items: center;
    justify-content: center;
    &::before {
      content: "";
      width: 32rpx;
      height: 32rpx;
      border-radius: 50%;
      margin-right: 16rpx;
    }
    &--primary::before {
      background-color: $uni-color-primary;
    }
    &--success::before {
      background-color: $uni-answer-success;
    }
    &--error::before {
      background-color: $uni-answer-error;
    }
    &--none::before {
      background-color: #ddd;
    }
  }
}
</style>