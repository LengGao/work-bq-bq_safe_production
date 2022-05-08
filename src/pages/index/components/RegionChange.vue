<template>
  <view class="regionChange">
    <scroll-view scroll-y show-scrollbar>
      <view class="head">
        <uni-icons type="location" size="40rpx" color="#BBBBBB" />
        <text class="address">{{ location.address }}</text>
      </view>

      <view class="buttons-bar">
        <button v-for="(button, index) in buttons" :key="button.id" class="btn"
                :class="button.checked ? 'active' : 'default'" @click="onClick(index)">
          {{ button.title }}
        </button>
      </view>
    </scroll-view>

    <view style="height: 200rpx"></view>
  </view>
</template>

<script>
export default {
  props: {
    location: { type: Object, default: {} },
    buttons: { type: Array, default: [] }
  },
  methods: {
    onClick(index) {
      this.$emit('change', { index, checked: true })
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.regionChange {
  overflow: auto;
  padding-left: 40rpx;
  padding-right: 40rpx;
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
  max-height: calc(100vh - var(--window-bottom));
}

.head {
  padding: 40rpx 0 20rpx;

  .address {
    margin-left: 10rpx;
    font-size: $font-size-md;
    color: $text-color-grey;
  }
}

.buttons-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
}

.btn {
  width: 28%;
  margin: 16rpx 8rpx;
  font-size: $font-size-base;
  border-width: 2rpx;
  border-style: solid;
  background-color: #fff;
}

.active {
  color: #007aff;
  border-color: #007aff;
}

.default {
  color: #777;
  border-color: #f8f8f8;
}
</style>