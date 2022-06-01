<template>
  <div class="dropdown-filter" @touchmove.stop.prevent>
    <div class="dropdown-filter-header" @click="hanldeToggle">
      <uni-icons custom-prefix="iconfont" class="header-icon" type="icon-fenlei" size="36rpx" color="#199fff">
      </uni-icons>
      <view class="header-title">{{activeRightName || defaultName}}</view>
      <uni-icons v-if="arrow" custom-prefix="iconfont" class="header-icon" :class="{'header-icon--up':show}"
                 type="icon-sanjiao1" size="24rpx"></uni-icons>
    </div>
    <div class="dropdown-filter-container" :class="{'dropdown-filter-container--popup':show}">
      <div class="container-left">
        <div class="container-left-item" @click="handleLeftClick(index)"
             :class="{'container-left-item--active':activeLeftIndex === index}" v-for="(item,index) in list"
             :key="item.value">{{item.name}}
        </div>
      </div>
      <div class="container-center">
        <div class="container-center-item" @click="handleCenterClick(indexCenter)" v-for="(item, indexCenter) in listCenter"
            :class="{'container-left-item--active': activeCenterIndex === indexCenter}"
             :key="item.value">{{item.name}}
        </div>
      </div>
      <div class="container-right">
        <div class="container-right-item" @click="handleRightClick(item)" v-for="(item) in listRight"
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
    nodeList: {
      type: Array,
      default: () => ([])
    },
    arrow: {
      type: Boolean,
      default: false
    },
    nameKey: {
      type: String,
      default: 'title'
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
      activeLeftIndex: 0,
      activeCenterIndex: 0,
      activeRightName: '',
      list: [],
      listCenter: [],
      listRight: [],
    }
  },
  computed: {
    defaultName() {
      return '全部分类'
    }
  },
  created() {
    this.normalizeData(this.nodeList)
  },
  methods: {
    normalizeData(list) {
      let nameKey = this.nameKey, valueKey = this.valueKey, childrenKey = this.childrenKey

      const normalize = (data) => {
        let stack = []
        for (let i = 0, ii = data.length; i < ii; i++) {
          let item = data[i], _item = {}
          _item.name = item[nameKey]
          _item.value = item[valueKey]
          if (item[childrenKey]) {
            _item.children = normalize(item[childrenKey])
          } else {
            _item.children = []
          }
          stack[i] = _item
        }
        return stack
      }
      this.list = normalize(list)
    },
    handleRightClick(item) {
      this.activeRightName = item.name
      this.$emit('input', item.value)
      this.$emit('change', item.value)
      this.hanldeToggle()
    },
    handleCenterClick(index) {
      this.activeCenterIndex = index
      this.listRight = this.listCenter[this.activeCenterIndex].children
    },
    handleLeftClick(index) {
      this.activeLeftIndex = index
      this.listCenter = this.list[this.activeLeftIndex].children
      this.activeCenterIndex = 0
      this.listRight = []
      let item = this.list[this.activeLeftIndex]
      if (item.value === -1) {
        this.$emit('input', item.value)
        this.$emit('change', item.value)
        this.activeRightName = item.name
        this.hanldeToggle()
      }
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
    .container-center {
      flex: 1;
      background-color: #fcfcfc;
      &-item {
        padding: 24rpx 16rpx;
        font-size: $uni-font-size-base;
        color: $uni-text-color;
      }
      &--active {
        background-color: #f2f6fc;
        color: $uni-color-primary;
        border-color: $uni-color-primary;
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