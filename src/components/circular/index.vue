<template>
  <div class="circular" :class="className" @click="onClick">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "circular",
  props: {
    type: {
      type: String,
      default: "none",
    },
  },
  computed: {
    className() {
      return `circular--${this.type}`;
    },
  },
  methods: {
    onClick(e) {
      this.$emit("click", e);
    },
  },
};
</script>
<style lang="scss" scoped>
.circular {
  width: 80rpx;
  height: 80rpx;
  text-align: center;
  line-height: 80rpx;
  background-color: #eee;
  font-size: 24rpx;
  margin: 20rpx 25rpx;
  color: #666;
  border-radius: 50%;
  &--success {
    background-color: $uni-color-success;
    color: #fff;
  }
  &--error {
    background-color: $uni-color-error;
    color: #fff;
  }
  &--primary {
    background-color: $uni-color-primary;
    color: #fff;
  }
  &:active {
    opacity: 0.8;
  }
}
</style>