<template>
  <view class="answer-bar">
    <view class="answer-bar-item" :class="{'answer-bar-item--disabled':isStart}" @click="onClickPrev">
      <uni-icons custom-prefix="iconfont" :color="isStart?'#ddd':''" type="icon-fanhui" size="28rpx"></uni-icons>
      <view class="bar-text">上一题</view>
    </view>
    <view class="answer-bar-item" @click="onClickCard">
      <uni-icons custom-prefix="iconfont" type="icon-datiqia" size="28rpx"></uni-icons>
      <view class="bar-text">答题卡</view>
    </view>
    <view class="answer-bar-item" @click="onClickCollect">
      <uni-icons custom-prefix="iconfont" v-if="!!isCollection" color="#199fff" type="icon-shoucang" size="28rpx">
      </uni-icons>
      <uni-icons custom-prefix="iconfont" v-else type="icon-shoucang1" size="28rpx"></uni-icons>
      <view class="bar-text">收藏</view>
    </view>
    <view class="answer-bar-item" v-if="model === 2">
      <uni-icons custom-prefix="iconfont" type="icon-time" size="28rpx"></uni-icons>
      <view class="bar-text">
        <uni-countdown :show-day="false" @timeup="onTimeUp" :hour="0" :minute="0" :second="time" />
      </view>
    </view>
    <view class="answer-bar-item" v-if="model === 2 && isEnd" @click="onSubmitPaper">
      <uni-icons custom-prefix="iconfont" type="icon-jiaojuan" size="28rpx"></uni-icons>
      <view class="bar-text">交卷</view>
    </view>
    <view class="answer-bar-item" v-else-if="model === 1 && isEnd" @click="endPractice">
      <uni-icons custom-prefix="iconfont" type="icon-jiaojuan" size="28rpx"></uni-icons>
      <view class="bar-text">结束练习</view>
    </view>
    <view v-else class="answer-bar-item" :class="{'answer-bar-item--disabled':isEnd}" @click="onClickNext">
      <uni-icons custom-prefix="iconfont" :color="isEnd?'#ddd':''" type="icon-xiayige-01" size="28rpx"></uni-icons>
      <view class="bar-text">下一题</view>
    </view>
  </view>
</template>
<script>
export default {
  name: "answerBar", // 答题下方的状态栏
  props: {
    isCollection: {
      type: [Boolean, Number, String],
      default: false,
    },
    isEnd: {
      type: Boolean,
      default: false,
    },
    isStart: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Number,
      default: 0,
    },
    model: {
      type: [String, Number],
      default: 1,
    },
  },
  methods: {
    onTimeUp(e) {
      this.$emit('timeup', e)
    },
    onSubmitPaper(e) {
      this.$emit("submit-paper", e);
    },
    endPractice(e) {
      this.$emit("end-practice", e);
    },
    onClickNext(e) {
      !this.isEnd && this.$emit("next", e);
    },
    onClickCollect(e) {
      this.$emit("collect", e);
    },
    onClickCard(e) {
      this.$emit("card", e);
    },
    onClickPrev(e) {
      !this.isStart && this.$emit("prev", e);
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
  &-item {
    &--disabled {
      color: #ddd;
    }
  }
}
::v-deep .uni-countdown__splitor {
  margin: 0;
}
</style>