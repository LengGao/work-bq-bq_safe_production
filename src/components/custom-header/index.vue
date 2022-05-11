<template>
  <view class="custom-header">
    <view class="status_bar"></view>
    <view class="nav-bar">
      <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="28rpx"></uni-icons>
      <slot name="title"><text class="nav-bar-title"> {{ title }} </text></slot>
    </view>
  </view>
</template>

<script>
export default {
  name: 'custom-header',
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  methods: {
    goBack() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-header {
  width: 100%;

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .nav-bar {
    display: flex;
    align-items: center;
    height: 44px; // 固定值
    font-size: 32rpx;
    color: #fff;

    &-back {
      padding: 0 20rpx;
    }

    &-title {
      margin: 0 auto;
      padding-right: 60rpx;
    }
  }
}

</style>