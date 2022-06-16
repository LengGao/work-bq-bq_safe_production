<template>
  <view class="answer-bar">
    <view class="answer-bar-item" :class="{'answer-bar-item--disabled':isStart}" @click="onClickPrev">
      <uni-icons custom-prefix="iconfont" :color="isStart?'#ddd':''" type="icon-fanhui" size="28rpx"></uni-icons>
      <view class="bar-text">上一题</view>
    </view>
    <view class="answer-bar-item" v-if="!analysis">
      <uni-icons custom-prefix="iconfont" type="icon-time" size="28rpx"></uni-icons>
      <view class="bar-text">
        <uni-countdown v-if="showTimer" :show-day="false" @timeup="onTimeUp" :hour="0" :minute="0" :second="time" />
      </view>
    </view>
    <view class="answer-bar-item" v-if="isEnd" @click="onSubmitPaper">
      <uni-icons custom-prefix="iconfont" type="icon-jiaojuan" size="28rpx"></uni-icons>
      <view class="bar-text" v-if="analysis"> {{ pass ? '继续学习' :'再考一次' }}</view>
      <view class="bar-text" v-else>交卷</view>
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
      type: Boolean,
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
    currentIndex: {
      type: [String, Number],
      default: 0,
    },
    analysis: {
      type: Boolean,
      default: false,
    },
    pass: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showTimer: true  
    }
  },
  watch: {
    currentIndex() {
     this.showTimer = false
     this.$nextTick(() => {
      this.showTimer= true
     })
    }
  },
  methods: {
    onTimeUp(e) {
      this.$emit('timeup', e)
    },
    onSubmitPaper(e) {
      this.$emit("submit-paper", e);
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