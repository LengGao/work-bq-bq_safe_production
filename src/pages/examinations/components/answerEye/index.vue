<template>
  <view class="answer-eye" :class="{ 'answer-eye--active': active }">
    <view class="eye-btn" @click="handleClick">
      <uni-icons custom-prefix="iconfont" v-show="active" color="#199fff" type="icon-view" size="32rpx">
      </uni-icons>
      <uni-icons custom-prefix="iconfont" v-show="!active" type="icon-hide" size="32rpx">
      </uni-icons>
      <text class="text">答案</text>
    </view>
  </view>
</template>
<script>
export default {
  name: "answerEye", // 查看答案
  props: {
    correctAnswer: {
      type: [Array, String, Number],
      default: "",
    },
    model: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      active: false,
    };
  },
  mounted() {
    if (this.correctAnswer.length ) {
      this.handleClick()
    }
  },
  methods: {
    handleClick() {
      this.active = !this.active;
      this.$emit("change", this.active);
    },
  },
};
</script>
<style lang="scss" scoped>
.answer-eye {
  display: flex;
  justify-content: flex-end;
  font-size: 24rpx;
  .eye-btn {
    border: $uni-border;
    padding: 6rpx 20rpx;
    border-radius: 10rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .iconfont {
      margin-right: 10rpx;
    }
  }

  &--active {
    .eye-btn {
      border-color: $uni-color-primary;
      color: $uni-color-primary;
    }
  }
}
</style>