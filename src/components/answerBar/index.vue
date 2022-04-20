<template>
  <view class="answer-bar">
    <view class="answer-bar-item" @click="onClickPrev">
      <uni-icons custom-prefix="iconfont" type="icon-fanhui" size="28rpx"></uni-icons>
      <view class="bar-text">上一题</view>
    </view>
    <view class="answer-bar-item" @click="onClickCard">
      <uni-icons custom-prefix="iconfont" type="icon-datiqia" size="28rpx"></uni-icons>
      <view class="bar-text">答题卡</view>
    </view>
    <view class="answer-bar-item" @click="onClickCollect">
      <uni-icons custom-prefix="iconfont" v-show="isCollection" color="#199fff" type="icon-shoucang" size="28rpx">
      </uni-icons>
      <uni-icons custom-prefix="iconfont" v-show="!isCollection" type="icon-shoucang1" size="28rpx"></uni-icons>
      <view class="bar-text">收藏</view>
    </view>
    <view class="answer-bar-item" v-if="showTime">
      <uni-icons custom-prefix="iconfont" type="icon-time" size="28rpx"></uni-icons>
      <view class="bar-text">
        <slot></slot>
      </view>
    </view>
    <view class="answer-bar-item" @click="onClickNext">
      <uni-icons custom-prefix="iconfont" type="icon-xiayige-01" size="28rpx"></uni-icons>
      <view class="bar-text">下一题</view>
    </view>
  </view>
</template>
<script>
export default {
  name: "answerBar",
  props: {
    isCollection: {
      type: Boolean,
      default: false,
    },
    showTime: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onClickNext(e) {
      this.$emit("next", e);
    },
    onClickCollect(e) {
      this.$emit("collect", e);
    },
    onClickCard(e) {
      this.$emit("card", e);
    },
    onClickPrev(e) {
      this.$emit("prev", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.answer-bar {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 100rpx;
  border-top: $uni-border;
  font-size: 28rpx;
  text-align: center;
  background: #fff;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
</style>