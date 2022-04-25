<template>
  <div class="dropdown-select" @touchmove.stop.prevent>
    <div class="dropdown-select-header" @click="hanldeToggle">
      <view class="header-title">{{activeName}}</view>
      <uni-icons custom-prefix="iconfont" class="header-icon" :class="{'header-icon--up':show}" type="icon-sanjiao1"
                 size="24rpx"></uni-icons>
    </div>
    <div class="dropdown-select-mask" @click="hanldeToggle" v-if="show" @touchmove.stop.prevent></div>
    <div class="dropdown-select-container" :class="{'dropdown-select-container--popup':show}">
      <div class="dropdown-select-option" @click="handleClick(item.value)"
           :class="{'dropdown-select-option--active':item.value === value}" v-for="item in data" :key="item.value">
        <div> {{item.name}}</div>
        <uni-icons type="checkmarkempty" v-show="item.value === value" color="#199fff" size="28rpx"></uni-icons>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: [Number, String],
      default: ''
    },
    data: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    activeName() {
      const targetData = this.data.filter(item => item.value === this.value).concat(this.data[0])
      return targetData[0].name
    }
  },
  methods: {
    handleClick(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.hanldeToggle()
    },
    hanldeToggle() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-select {
  height: 100%;
  color: #333;
  &-header {
    position: relative;
    z-index: 100;
    background-color: #fff;
    height: 88rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    .header-title {
      margin-right: 16rpx;
    }
    .header-icon {
      transition: transform 0.3s;
      &--up {
        transform: rotate(-180deg);
      }
    }
  }
  &-mask {
    position: fixed;
    top: calc(var(--window-statsu-bar) + 44px + 88rpx);
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
    opacity: 0.3;
    z-index: 11;
    transition: transform 0.3s;
  }
  &-container {
    position: fixed;
    top: calc(var(--window-statsu-bar) + 44px + 88rpx);
    left: 0;
    width: 100%;
    z-index: 12;
    padding: 0 20rpx;
    box-sizing: border-box;
    transition: transform 300ms ease 0ms;
    transform: translateY(-120%);
    background-color: #fff;
    &--popup {
      transform: translateY(0);
    }
  }
  &-option {
    background-color: #fff;
    padding: 20rpx 12rpx;
    border-bottom: 2rpx solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
    &--active {
      color: $uni-color-primary;
    }
  }
}
</style>