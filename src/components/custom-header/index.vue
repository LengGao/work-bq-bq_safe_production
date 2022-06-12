<template>
  <view class="custom-header" v-if="!isWeixinJSBridge">
    <view class="status_bar"></view>
    <view class="nav-bar" :style="{'background-color':  backgroundColor }">    
      <uni-icons class="nav-bar-back" type="back" color="#fff" size="16px" @click="goBack" />
      <slot name="title"><text class="nav-bar-title"> {{ title }} </text></slot>
    </view>
  </view>
</template>

<script>
import { browser } from '@/mixins/index'
export default {
  name: 'custom-header',
  mixins: [browser],
  props: {
    title: {
      type: String,
      default: '安培课堂'
    },
    customClass: {
      type: String,
      default: ''
    },
    customStyle: {
      type: String,
      default: ''
    },
    backgroundColor: {
      type: String,
      default: '#199fff'
    },
    prevFunction: {
      type: Function
    }
  },
  methods: {
    goBack() {
      if (this.prevFunction && !this.prevFunction()) { return; }
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        history.back()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.custom-header {
  position: relative;
  width: 100%;

  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }

  .nav-bar {
    display: flex;
    height: 44px; // 固定值
    font-size: 16px;
    line-height: 44px;
    color: #fff;
    padding-left: 10px;

    &-back {
      z-index: 99;
    }

    &-title {
      flex: 1;
      margin-left: -26px;
      text-align: center;
      z-index: 90;
    }
  }
}
</style>