<template>
  <div class="dropdown-select" @touchmove.stop.prevent>
    <div class="dropdown-select-header" @click="hanldeToggle">
      <uni-icons custom-prefix="iconfont" class="header-icon" type="icon-yduipaibanleixingliebiao"
                 size="36rpx" color="#199fff"></uni-icons>
      <view class="header-title">{{activeName}}</view>
      <uni-icons v-if="arrow" custom-prefix="iconfont" class="header-icon" :class="{'header-icon--up':show}" type="icon-sanjiao1"
                 size="24rpx"></uni-icons>
    </div>
    <div class="dropdown-select-mask" @click="hanldeToggle" v-if="show" @touchmove.stop.prevent></div>
    <div class="dropdown-select-container" :class="{'dropdown-select-container--popup':show}">
      <div class="dropdown-select-option" @click="handleClick(item.value)"
           :class="{'dropdown-select-option--active':item.value === value}" v-for="item in list" :key="item.value">
        <div> {{item.name}}</div>
        <uni-icons type="checkmarkempty" v-if="item.value === value" color="#199fff" size="28rpx"></uni-icons>
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
    nodeList: {
      type: Array,
      default: () => []
    },
    arrow: {
      type: Boolean,
      default: false
    },
    nameKey: {
      type: String,
      default: 'name'
    },
    valueKey: {
      type: String,
      default: 'id'
    },
    childrenKey: {
      type: String,
      default: 'sub'
    }
  },
  data() {
    return {
      show: false,
      list: []
    }
  },
  created() {
    this.normalizeData(this.nodeList)
    console.log('created', this.show);
  },
  computed: {
    activeName() {
      if (this.list.length) {
        const targetData = this.list.filter(item => item.value === this.value)
        return targetData[0].name
      } else {
        return '全部'
      }
    }
  },
  methods: {
    handleClick(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.hanldeToggle()
    },
    hanldeToggle() {
      console.log('hanldeToggle', this.show);
      this.show = !this.show
    },
    normalizeData(list) {
      this.list = list.map(item => ({name: item[this.nameKey], value: item[this.valueKey]}))
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
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    height: 88rpx;
    background-color: #fff;
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
    transform: translateY(-200%);
    background-color: #fff;
    &--popup {
      transform: translateY(0);
    }
  }
  &-option {
    display: flex;
    justify-content: space-between;
    padding: 20rpx 12rpx;
    align-items: center;
    font-size: $uni-font-size-base;
    color: #333;
    background-color: #fff;
    border-bottom: 2rpx solid #eee;
    &--active {
      color: $uni-color-primary;
    }
  }
}
</style>