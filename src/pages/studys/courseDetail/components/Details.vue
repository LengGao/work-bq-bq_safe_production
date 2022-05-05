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
          <uni-icons customPrefix="iconfont" type="icon-user1" size="28rpx" color="#199fff" />
          <text class="staff">赵老师</text>
        </view>
        <text class="person">500人在学</text>
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
$title-size: 34rpx;
$subtitle-size: 24rpx;
$text-size: 12rpx;

.card {
  display: flex;
  flex-direction: column;
  padding: 28rpx;
  color: #333;

  .title {
    font-size: $title-size;
    font-weight: bold;
  }

  .subtitle {
    margin-top: 24rpx;
    font-size: $subtitle-size;
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 24rpx;
    font-size: $text-size;

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
    font-size: $title-size;
    font-weight: bold;
    line-height: calc(2 * $title-size);
  }

  .pane-text {
    height: calc(2 * $subtitle-size);
    font-size: $subtitle-size;
    line-height: calc(2 * $subtitle-size);
  }
}
</style>