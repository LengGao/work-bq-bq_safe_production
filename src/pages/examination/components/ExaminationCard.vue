<template>
  <view class="xamination-card" @click="handleClick">
    <view class="logan-card-body-row">
      <view class="logan-card-body-left">
        <image :src="leftImage || errorImage" class="logan-card-row-image" mode="aspectFit" />
      </view>
      <view class="logan-card-body-right">
        <view class="logan-card-right-top">
          <text>{{ rightTop }}</text>
        </view>
        <view class="logan-card-right-footer">
          <text>{{ rightFooter }}</text>
        </view>
      </view>
      <view class="card-arrow">
        <uni-icons type="forward" size="32rpx" color="#E0E0E0" />
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
    handleClick(e) {
      this.$emit('click', e)
    },
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
@import "@/styles/logan.scss";
$size: 80rpx;

.logan-card-body-row {
  height: 100%;
}

.logan-card-body-left {
  width: $size;
}

.logan-card-row-image {
  width: $size;
  height: $size;
}

.logan-card-body-right {
  height: calc($size + 40rpx);
}

.logan-card-right-top {
  font-size: $font-size-md;
  font-weight: bold;
  line-height: calc(2 * $font-size-md);
}

.logan-card-right-footer {
  font-size: $font-size-sm;
  line-height: calc(2 * $font-size-sm);
}
</style>