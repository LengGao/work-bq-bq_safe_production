<template>
  <view class="option" :class="status ? `option--${status}` : ''">
    <view class="option-label">
      <uni-icons custom-prefix="iconfont" v-if="status === 'success'" color="#fff" type="icon-duigou" size="28rpx">
      </uni-icons>
      <uni-icons custom-prefix="iconfont" v-else-if="status === 'error'" color="#fff" type="icon-cha" size="28rpx">
      </uni-icons>
      <text v-else>
        <slot name="label"> {{ label }}</slot>
      </text>
    </view>
    <view class="option-text">
      <slot></slot>
    </view>
  </view>
</template>
<script>

export default {
  name: "IOption",
  props: {
    status: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      default: "",
    },
  },
  computed: {},
  data() {
    return {
      checkedValue: this.value,
    };
  },
  methods: {
  },
};
</script>
<style lang="scss" scoped>
.option {
  border: $uni-border;
  padding: 20rpx 18rpx;
  border-radius: 10rpx;
  display: flex;
  margin-bottom: 30rpx;
  align-items: center;
  &-label {
    width: 44rpx;
    height: 44rpx;
    line-height: 44rpx;
    border-radius: 50%;
    border: $uni-border;
    text-align: center;
    flex-shrink: 0;
    margin-right: 12rpx;
  }
  &-text {
    flex: 1;
  }
  &--active {
    color: $uni-color-primary;
    border-color: $uni-color-primary;
    .option-label {
      border-color: $uni-color-primary;
      background-color: $uni-color-primary;
      color: #fff;
    }
    .iconfont {
      color: $uni-color-primary;
    }
  }
  &--success {
    color: $uni-answer-success;
    border-color: $uni-answer-success;
    .option-label {
      border-color: $uni-answer-success;
      background-color: $uni-answer-success;
      color: #fff;
    }
  }
  &--error {
    color: $uni-answer-error;
    border-color: $uni-answer-error;
    .option-label {
      border-color: $uni-answer-error;
      background-color: $uni-answer-error;
      color: #fff;
    }
    .iconfont {
      color: $uni-answer-error;
    }
  }
}
</style>