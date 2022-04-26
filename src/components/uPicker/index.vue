<template>
  <view class="u-picker picker-mask" v-if="show" @click.native="onClickMash">
    <view class="picker-view">
      <view class="picker-head">
        <view class="picker-head-cancel">取消</view>
        <view class="picker-head-title">日日</view>
        <view class="picker-head-confirm">确定</view>
      </view>
      <picker-view :value="value" @change="bindChange" indicator-class="picker-column-indicator" class="picker-area">
        <picker-view-column class="picker-column">
          <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
        </picker-view-column>
        <picker-view-column class="picker-column">
          <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
        </picker-view-column>
        <picker-view-column class="picker-column">
          <view class="item" v-for="(item,index) in years" :key="index">{{item}}年</view>
        </picker-view-column>
      </picker-view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    show: {
      type: Boolean,
      default:  () => false
    }
  },
  data: function () {
    const date = new Date()
    const years = []
    const year = date.getFullYear()
    const months = []
    const month = date.getMonth() + 1
    const days = []
    const day = date.getDate()
    for (let i = 1990; i <= date.getFullYear(); i++) {
      years.push(i)
    }
    for (let i = 1; i <= 12; i++) {
      months.push(i)
    }
    for (let i = 1; i <= 31; i++) {
      days.push(i)
    }
    return {
      title: 'picker-view',
      years,
      year,
      months,
      month,
      days,
      day,
      value: [9999, month - 1, day - 1],
    }
  },
  methods: {
    onClickMash() {
      this.$emit('close')
    },
    bindChange: function (e) {
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/logan.scss";
.u-picker {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
}

.picker-mask {
  background-color: rgba(0, 0, 0, 0.4);
}

// 选中滤镜陶都
.picker-column-indicator {
  height: 100rpx;
}

.picker-view {
  position: absolute;
  bottom: 0;
  width: 750rpx;
  min-height: 20vh;
  max-height: 50vh;
}

.picker-area {
  width: 750rpx;
  height: 600rpx;
  background-color: #fff;
}

.picker-column {
  justify-content: center;
  align-items: center;
  text-align: center;
}

.picker-head {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;    
  text-align: center;
  font-size: $font-size-md;
  padding: 20rpx 80rpx;
  background: #f8f8f8;
  box-sizing: border-box;

  &-cancel {
    width: 248rpx;
  }

  &-title {
    color: #2c405a;
  }

  &-confirm {
    width: 248rpx;
  }
}
</style>