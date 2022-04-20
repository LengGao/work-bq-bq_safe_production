<template>
  <view class="option" :class="status ? `option--${status}` : ''" @click="handleClick">
    <view class="option-label">
      <uni-icons custom-prefix="iconfont" v-if="status === 'success'" color="#fff" type="icon-duigou" size="28rpx">
      </uni-icons>
      <uni-icons custom-prefix="iconfont" v-else-if="status === 'error'" color="#fff" type="icon-cha" size="28rpx">
      </uni-icons>
      <text v-else>{{ !noletter ? label : "" }}</text>
    </view>
    <view class="option-text">
      <slot></slot>
    </view>
  </view>
</template>
<script>
export default {
  name: "option",
  props: {
    noletter: {
      type: Boolean,
      default: false,
    },
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
    handleClick() {
      this.$emit("change", this.checkedValue);
    },
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
    color: $uni-color-success;
    border-color: $uni-color-success;
    .option-label {
      border-color: $uni-color-success;
      background-color: $uni-color-success;
      color: #fff;
    }
  }
  &--error {
    color: $uni-color-error;
    border-color: $uni-color-error;
    .option-label {
      border-color: $uni-color-error;
      background-color: $uni-color-error;
      color: #fff;
    }
    .iconfont {
      color: $uni-color-error;
    }
  }
}
</style>