<template>
  <view class="footer">
    <template v-if="model === 1">
      <view class="btn" @click="handleClick">继续练习</view>
    </template>
    <template v-else-if="model === 2">
      <view class="btn plain" @click="handleClick">继续做题</view>
      <view class="btn" @click="handleSubmit">马上交卷</view>
    </template>
    <template v-else>
      <view class="btn" @click="handleClick">查看全部解析</view>
    </template>
  </view>
</template>
<script>
export default {
  name: "IFooter",
  props: {
    model: {
      type: [String, Number],
      default: 1,
    },
  },
  methods: {
    handleClick(e) {
      this.$emit("click", e);
    },
    handleSubmit(e) {
      this.$emit("submit", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.footer {
  padding: 0 20rpx;
  border-top: $uni-border;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  .btn {
    color: #fff;
    background-color: $uni-color-primary;
    padding: 10rpx 0;
    width: 300rpx;
    text-align: center;
    border-radius: 10rpx;
    &:not(:first-child) {
      margin-left: 20rpx;
    }
    &:active {
      opacity: 0.8;
    }
    &.plain {
      background-color: #fff;
      border: 1px solid $uni-color-primary;
      padding: 8rpx 0;
      color: $uni-color-primary;
    }
  }
}
</style>