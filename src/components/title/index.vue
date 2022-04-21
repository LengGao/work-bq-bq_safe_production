<template>
  <div class="title" :style="{ color }">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "title",
  props: {
    color: {
      type: String,
      default: "#999",
    },
  },
};
</script>
<style lang="scss" scoped>
.title {
  color: #999;
  font-size: 32rpx;
  font-weight: bold;
  margin: 26rpx 0;
  display: flex;
  align-items: center;
  &::before {
    content: "";
    background-color: $uni-color-primary;
    width: 4rpx;
    height: 32rpx;
    margin-right: 10rpx;
  }
}
</style>