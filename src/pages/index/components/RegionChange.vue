<template>
  <view class="regionChange">
    <view class="head">
      <uni-icons type="location" size="36rpx" color="#BBBBBB" />
      <text class="address">请选择所在地区</text>
    </view>

    <view class="buttons-bar">
      <button v-for="(button, index) in buttons" :key="button.id" class="btn"
              :class="button.checked ? 'active' : 'default'" @click="onClick(index)">
        {{ button.region }}
      </button>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    location: { type: Object, default: () => ({}) },
    buttons: { type: Array, default: () => ([]) }
  },
  watch: {
    location(val) {
      this.init(val)
    }
  },
  mounted() {
    this.init(this.location)
  },
  methods: {
    init(location) {
      console.log('val', location);
      this.buttons.forEach(button => {
        if (button.id === location.id) button.checked = true
      })
    },
    onClick(index) {
      let prev = this.buttons.findIndex(button => button.checked)
      this.buttons[prev].checked = false
      this.buttons[index].checked = true
      let button = this.buttons[index]
      this.$emit('change', button)
      this.$emit('close')
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.regionChange {
  overflow: auto;
  padding: 0 40rpx;
  max-height: calc(100vh - var(--window-bottom));
}

.head {
  padding: 40rpx 0 20rpx;
  display: flex;
  flex-direction: row;
  align-items: center;

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
  font-size: $font-size-sm;
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