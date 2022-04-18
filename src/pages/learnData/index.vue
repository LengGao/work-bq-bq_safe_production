<template>
  <view class="learn-data">
    <view class="learn-data-header">
      <view class="status_bar"></view>
      <view class="nav-bar"
        ><uni-icons type="back" color="#fff" size="20"></uni-icons>
        <text class="nav-bar-title">学习数据</text>
      </view>
    </view>
    <view class="learn-data-select">
      <uni-icons type="bars" color="#fff" size="20"></uni-icons>
      <text class="course-name">学习数据</text>
    </view>
    <div class="learn-data-card">
      <div class="learn-data-card-header">
        <div class="learn-data-card-header-title">
          <div>本周数据</div>
          <uni-icons
            type="paperplane-filled"
            color="#fff"
            size="20"
          ></uni-icons>
        </div>
        <div class="learn-data-card-header-tabs">
          <div class="tab-item">
            <div class="tab-item-value"><text>888</text> 分钟</div>
            <div class="tab-item-title">本周累计</div>
          </div>
          <div class="tab-item">
            <div class="tab-item-value"><text>888</text> 分钟</div>
            <div class="tab-item-title">今日已学</div>
          </div>
          <div class="tab-item">
            <div class="tab-item-value"><text>56</text> %</div>
            <div class="tab-item-title">打败同学</div>
          </div>
        </div>
      </div>
      <div class="learn-data-card-content"></div>
    </div>
    <div class="learn-data-card">
      <div class="learn-data-card-header">
        <div class="learn-data-card-header-title">
          <div>累计数据</div>
          <uni-icons
            type="paperplane-filled"
            color="#fff"
            size="20"
          ></uni-icons>
        </div>
      </div>
      <div class="learn-data-card-content block">
        <div class="block-item primary">
          <div class="block-item-value">
            <text>110</text>
            分钟
          </div>
          <div class="block-item-title">累计学习时长</div>
        </div>
        <div class="block-item warning">
          <div class="block-item-value">
            <text>110</text>
            天
          </div>
          <div class="block-item-title">累计学习天数</div>
        </div>
        <div class="block-item success">
          <div class="block-item-value">
            <text>88</text>
            个
          </div>
          <div class="block-item-title">完成学时总数</div>
        </div>
        <div class="block-item danger">
          <div class="block-item-value">
            <text>78</text>
            %
          </div>
          <div class="block-item-title">课程总进度</div>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
export default {
  components: {},
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.learn-data {
  height: 100%;
  padding-bottom: 40rpx;
  background: url("../../static/learn-data-bc.png") no-repeat;
  background-size: 100% 686rpx;
  font-size: $font-size-base;
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  &-header {
    padding: 0 20rpx;
    .nav-bar {
      height: 44px;
      font-size: $font-size-base;
      display: flex;
      align-items: center;
      color: #fff;
      &-title {
        margin: 0 auto;
      }
    }
  }
  &-select {
    padding: 20rpx;
    display: flex;
    align-items: center;
    .course-name {
      color: #fff;
      margin-left: 17rpx;
    }
  }
  &-card {
    margin: 0 40rpx 40rpx 40rpx;
    border-radius: 12rpx;
    color: #fff;
    box-shadow: 0 0 6px #199fff;
    &-header {
      padding: 32rpx;
      border-top-left-radius: 12rpx;
      border-top-right-radius: 12rpx;
      background: linear-gradient(to right, #11c2fa, #4087f5);
      &-title {
        display: flex;
        justify-content: space-between;
        font-size: $font-size-lg;
      }
      &-tabs {
        padding-top: 20rpx;
        display: flex;
        .tab-item {
          width: 33%;
          text-align: center;
          &-title {
            opacity: 0.8;
          }
          &-value text {
            font-size: 48rpx;
          }
        }
      }
    }
    &-content {
      height: 400rpx;
      border-bottom-left-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      background-color: #fff;
      &.block {
        display: flex;
        flex-wrap: wrap;
        color: #000;
        .block-item {
          width: 40%;
          margin: 30rpx;
          border-radius: 12rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .block-item-value text {
            font-size: 48rpx;
          }
          &.primary {
            background-color: #f2fdff;
            .block-item-value {
              color: #199fff;
            }
          }
          &.success {
            background-color: #f3fef4;
            .block-item-value {
              color: #2bc83a;
            }
          }
          &.warning {
            background-color: #fffbf2;
            .block-item-value {
              color: #ff7d31;
            }
          }
          &.danger {
            background-color: #f7f8ff;
            .block-item-value {
              color: #5a66e6;
            }
          }
        }
      }
    }
  }
}
</style>