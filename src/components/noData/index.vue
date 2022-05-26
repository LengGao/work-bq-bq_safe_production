<template>
  <view class="no-data" :style="{ top }">
    <image class="img" src="@/static/no-data.png"></image>
    <view class="text">
      <slot>暂无数据</slot>
    </view>
  </view>
</template>
<script>
export default {
  name: "noData",
  props: {
    top: {
      type: String,
      default: "30%",
    },
  },
};
</script>
<style lang="scss" scoped>
.no-data {
  position: absolute;
  top: 30%;
  left: 0;
  width: 100%;
  text-align: center;
  font-size: $uni-font-size-base;
  .img {
    width: 280rpx;
    height: 264rpx;
  }
  .text {
    margin-top: 40rpx;
    color: #999;
  }
}
</style>