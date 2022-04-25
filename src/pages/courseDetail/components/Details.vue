<template>
  <view class="detail">
    <view class="card">
      <view class="title">
        新《安全生产法》宣传片
      </view>
      <view class="subtitle">
        12章24课时  |  共30学时        
      </view>
      <view class="fotter">
        <view class="left">
          <uni-icons customPrefix="iconfont" type="icon-user1" size="36rpx" color="#199fff" />
          <text class="staff">赵老师</text>
        </view>
        <view class="right">
          <text class="person">500人在学</text>
        </view>
      </view>
    </view>

    <view class="card card-type-pane">
      <view class="pane">
        <text class="pane-title">课程介绍</text>
        <text class="pane-text">整个课程共60集，分初中级循序渐进(完结)</text>
      </view>
      <view class="pane">
        <text class="pane-title">学习目的</text>
        <text class="pane-text">为了让自己更有料些，不求于他人，简单粗暴</text>
      </view>
      <view class="pane">
        <text class="pane-title">学习内容</text>
        <text class="pane-text">根据实际案例讲行解说，直击效果</text>
      </view>
    </view>

  </view>
</template>

<script>
export default {
  props: {
    detail: {
      type: Object,
      default: () => {}
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.card {
  display: flex;
  flex-direction: column;
  padding: 36rpx;
  color: #333;

  .title {
    font-size: $font-size-lg;
    font-weight: bold;
  }

  .subtitle {
    margin-top: 24rpx;
    font-size: $font-size-base;
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 24rpx;

    .staff {
      margin-left: 10rpx;
    }
  }
}

.card-type-pane {
  border-top: $logan-border-spacing-md;
}

.pane {
  display: flex;
  flex-direction: column;
  margin-bottom: 32rpx;
  color: #333;

  .pane-title {
    font-size: $font-size-lg;
    font-weight: bold;
  }

  .pane-text {
    font-size: $font-size-base;
    line-height: calc(2 * $font-size-base);
  }
}
</style>