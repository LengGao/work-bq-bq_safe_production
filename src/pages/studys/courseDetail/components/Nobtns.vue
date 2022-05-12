<template>
  <view class="nobtns">
    <view class="card">
      <view class="title"> 新《安全生产法》宣传片 </view>
      <view class="subtitle">12章24课时  |  共30学时</view>
      <view class="fotter">
        <view class="left">
          <uni-icons customPrefix="iconfont" type="icon-account-fill" size="48rpx" color="#199fff" />
          <view class="staff">赵老师</view>
        </view>
        <view class="right"> 199911人在学 </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$title-size: 34rpx;
$subtitle-size: 24rpx;
$text-size: 24rpx;

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
    margin-top: $subtitle-size;
    color: #777;
    font-size: $subtitle-size;
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 36rpx;
    font-size: $text-size;

    .left {
      display: flex;
      align-items: center;

      .staff {
        color: #777;
        font-size: $text-size;
        margin-left: 10rpx;
      }
    }

    .right {
      display: flex;
      align-items: center;
      font-size: $text-size;
      margin-left: 20rpx;
      color: #199fff;
    }
  }
}

.card-type-pane {
  border-top: $logan-border-spacing-md;
}
</style>