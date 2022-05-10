<template>
  <div class="dropdown-filter" @touchmove.stop.prevent>
    <div class="dropdown-filter-header" @click="hanldeToggle">
      <uni-icons custom-prefix="iconfont" class="header-icon" type="icon-fenlei"
                 size="36rpx" color="#199fff"></uni-icons>
      <view class="header-title">{{activeRightName || defaultName}}</view>
      <uni-icons v-if="arrow" custom-prefix="iconfont" class="header-icon" :class="{'header-icon--up':show}" type="icon-sanjiao1"
                 size="24rpx"></uni-icons>
    </div>
    <div class="dropdown-filter-container" :class="{'dropdown-filter-container--popup':show}">
      <div class="container-left">
        <div class="container-left-item" @click="handleLeftClick(index)"
             :class="{'container-left-item--active':activeLeftIndex === index}" v-for="(item,index) in data"
             :key="item.value">{{item.name}}</div>
      </div>
      <div class="container-right">
        <div class="container-right-item" @click="handleRightClick(item)" v-for="item in data[activeLeftIndex].children"
             :key="item.value">{{item.name}}
        </div>
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
      default: () => ([])
    },
    arrow: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      show: false,
      activeLeftIndex: 0,
      activeRightName: ''
    }
  },
  computed: {
    defaultName() {
      return this.data[0].children[0].name
    }
  },
  methods: {
    handleRightClick(item) {
      this.activeRightName = item.name
      this.$emit('input', item.value)
      this.$emit('change', item.value)
      this.hanldeToggle()
    },
    handleLeftClick(index) {
      this.activeLeftIndex = index
    },
    hanldeToggle() {
      this.show = !this.show
    }
  }
}
</script>

<style lang="scss" scoped>
.dropdown-filter {
  height: 100%;
  color: #333;
  &-header {
    position: relative;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 88rpx;
    background-color: #fff;
    font-size: $uni-font-size-base;
    color: $uni-text-color;
    .header-title {
      font-size: $uni-font-size-base;
      color: #909399;
      margin-right: 16rpx;
      margin-left: 8rpx;
    }
    .header-icon {
      transition: transform 0.3s;
      &--up {
        transform: rotate(-180deg);
      }
    }
  }
  &-container {
    position: fixed;
    top: calc(var(--window-statsu-bar) + 44px + 88rpx);
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    transition: opacity 300ms ease 0ms, transform 300ms ease 0ms,
    transform 300ms ease 0ms;
    transform: translateY(-120%);
    background-color: #fff;
    opacity: 0;
    display: flex;
    &--popup {
      opacity: 1;
      transform: translateY(0);
    }
    .container-left {
      width: 200rpx;
      flex-shrink: 0;
      &-item {
        padding: 24rpx 12rpx;
        text-align: center;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
        border-left: 6rpx solid #fff;
        &--active {
          background-color: #f2f6fc;
          color: $uni-color-primary;
          border-color: $uni-color-primary;
        }
      }
    }
    .container-right {
      flex: 1;
      background-color: #f2f6fc;
      &-item {
        padding: 24rpx 16rpx;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
      }
    }
  }
}
</style>