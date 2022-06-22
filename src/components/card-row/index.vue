<template>
  <view class="card-row">
    <view class="card-body" @click="onClickBody">
      <slot name="cardBodyLeft">
        <view class="card-body-left" @click="onClickLeft">
          <image @load="onLoadImage" @errr="onerrorImagee" class="card-row-image" :src="leftImage || errorImage"
                 mode="aspectFill" />
        </view>
      </slot>
      <slot name="cardBodyRight">
        <view class="card-body-right" @click="onClickRight">
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
import errorImage from '@/static/no-data.png'
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
    },
  },
  data() {
    return {
      errorImage: errorImage  // 异常图片
    }
  },
  mounted() {
  },
  methods: {
    onClickBody() {
      this.$emit('clickBody')
    },
    // 点击左槽
    onClickLeft() {
      this.$emit('clickLeft')
    },
    // 点击右槽
    onClickRight() {
      this.$emit('clickRight')
    },
    // 图片预览
    previewImg() {
      let url = this.leftImage || this.errorImage
      if (this.$listeners.previewImg) {
        this.$emit('previewImg', url)
      }
    },
    // 图片加载成功
    onLoadImage() {
      // console.log('onLoadImage', arguments);
    },
    // 图片加载失败
    onerrorImagee() {
      // console.log('onerrorImagee', arguments);
      Promise.resolve(errorImage).then(res => this.leftImage = res)
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$width: 230rpx;
$height: 140rpx;

.card-row {
  position: relative;
  border-top: 2rpx solid #f8f8f8;;
  padding: 16rpx 30rpx;
}

.card-body {
  position: relative;
  display: flex;
  flex-basis: 4;
  flex-direction: row;
  align-items: center;
  overflow: hidden;
  height: $height; // 同时控制着子元素的高度
  box-sizing: content-box;
}

.card-body-left {
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  flex: 1 1 1;
  height: 100%;
  width: $width;
}

.card-row-image {
  width: $width;
  height: $height;
  border-radius: 12rpx;
}

.card-body-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 3 1 0;
  height: 100%;
  overflow: hidden;
  margin-left: 20rpx;
  font-size: $font-size-base;
  letter-spacing: 1rpx;
}

.card-right-top {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
  color: $text-color;
}

.card-right-center {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
  font-size: $font-size-sm;
  color: $text-color-grey;
}

.card-right-footer {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  font-size: $font-size-sm;
  color: $text-color-grey;
}
</style>