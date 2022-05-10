<template>
  <view class="learn-certificate">
    <view class="learn-certificate-item">
      <view class="learn-certificate-item-title">课程名称</view>
      <view class="learn-certificate-item-time">获取时间：202121-221-4544</view>
      <view class="learn-certificate-item-image"><image @click="preiviewImg(src)" :src="src" mode="scaleToFill" /></view>
      <view class="learn-certificate-item-save">长按保存证书</view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      src: 'https://img0.baidu.com/it/u=4186264322,2530549324&fm=253&fmt=auto&app=138&f=JPG?w=707&h=500'
    };
  },
  methods: {
    preiviewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },

  },
};
</script>

<style lang="scss" scoped>
.learn-certificate {
  box-sizing: border-box;
  min-height: 100%;
  padding: 30rpx;
  background-color: #f7f7f7;
  &-item {
    padding: 22rpx;
    border-radius: 12rpx;
    background-color: #fff;
    margin-bottom: 40rpx;
    &-title {
      font-size: 30rpx;
      color: #303232;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        width: 8rpx;
        height: 32rpx;
        background-color: $uni-color-primary;
        margin-right: 8rpx;
      }
    }
    &-time {
      padding: 14rpx;
      font-size: $uni-font-size-sm;
      color: #a0a0a0;
    }
    &-image {
      text-align: center;
    }
    &-save {
      text-align: center;
      font-size: $uni-font-size-sm;
      color: #a0a0a0;
    }
  }
}
</style>