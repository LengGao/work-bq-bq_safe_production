<template>
  <view class="xamination-card">
    <view class="logan-card-body-row">
      <view class="logan-card-body-left">
        <image :src="leftImage || errorImage" class="logan-card-row-image" mode="aspectFit" />
      </view>
      <view class="logan-card-body-right">
        <view class="logan-card-right-top">{{ rightTop }}</view>
        <view class="logan-card-right-footer">{{ rightFooter }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import errorImage from "@/static/imgerror.png"

export default {
  props: {
    leftImage: {
      default: ''
    },
    rightTop: {
      default: ''
    },
    rightFooter: {
      default: ''
    }
  },
  data() {
    return {
      // 异常图片
      errorImage: errorImage
    }
  },
  methods: {
    // 图片架子陈功
    onLoadImage() {

    },
    // 图片架子啊失败 
    onErrorImage() {

    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/styles/logan.scss';
$size: $img-size-base;

.logan-card-body-left {
  width: $size;
}

.logan-card-row-image {
  width: $size;
  height: $size;
}
.logan-card-body-right {
   height: $size;
}
</style>