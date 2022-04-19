<template>
  <view class="card-row">
    <view class="card-body">
      <slot name="cardBodyLeft">
        <view class="card-body-left">
          <image @load="onLoadImage" @errr="onerrorImagee" class="card-row-image" :src="leftImage || errorImage"
                 mode="aspectFit" webp />
        </view>
      </slot>
      <slot name="cardBodyRight">
        <view class="card-body-right">
          <view class="card-right-top">
            <slot name="rightTop"> {{ rightTop }} </slot>
          </view>
          <view class="card-right-center">
            <slot name="rightCenter"> {{ rightCenter }} </slot>
            <slot name="rightCenterIcon"></slot>
          </view>
          <view class="card-right-footer">
            <slot name="rightFooter"> {{ rightFooter }} </slot>
            <slot name="rightFooterIcon"></slot>
          </view>
        </view>
      </slot>
    </view>
  </view>
</template>

<script>
import errorImage from '@/static/imgerror.png'
export default {
  name: 'CardRow',
  props: {
    leftImage: {
      default: ''
    },
    rightTop: {
      default: ''
    },
    rightCenter: {
      default: ''
    },
    rightFooter: {
      default: ''
    }
  },
  data() {
    return {
      errorImage: errorImage  // 异常图片
    }
  },
  mounted() {
  },
  methods: {
    // 图片加载成功
    onLoadImage() {
      console.log('onLoadImage', arguments);
    },
    // 图片加载失败
    onerrorImagee() {
      console.log('onerrorImagee', arguments);
      Promise.resolve(errorImage).then(res => this.leftImage = res)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.card-row {
  position: relative;
}

.card-body {
  position: relative;
  display: flex;
  flex-basis: 4;
  flex-direction: row;
  align-items: center;
  height: $img-size-height-md; // 同时控制着子元素的高度
  overflow: hidden;
  padding: 16rpx 20rpx;
  box-sizing: content-box;
}

.card-body-left {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  height: 100%;
  width: $img-size-width-md;
}

.card-row-image {
  width: $img-size-width-md;
  height: $img-size-height-md;
}

.card-body-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 3;
  height: 100%;
  overflow: hidden;
  margin-left: 20rpx;
  font-size: $font-size-base;
}

.card-right-top {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  flex: 0 1 1;
  width: 100%;
  color: $text-color;
}

.card-right-center {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex: 2 1 0;
  width: 100%;
  color: $text-color-grey;
}

.card-right-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  flex: 0 1 1;
  width: 100%;
  color: $text-color-grey;
}
</style>