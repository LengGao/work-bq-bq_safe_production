<template>
  <view class="btns">
    <view class="card">
      <view class="title">
        新《安全生产法》宣传片
      </view>
      <view class="subtitle">
        <uni-rate :value="1" readonly />
        <view class="person">199911人在学</view>
      </view>
      <view class="fotter">
        <view class="left">
          <text class="now-price">￥9999</text>
          <text class="origin-price">￥3333</text>
        </view>
        <view class="right">
          <!-- #ifdef MP-WEIXIN -->
          <view class="right-col">
            <button @click="onContact" class="share-btn" open-type="contact" plain size="mini">
              <uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="36rpx" />
              <text class="share-btn-text">咨询</text>
            </button>
          </view>
          <view class="right-col" style="margin-left: 40rpx;">
            <button @click="onShare" class="share-btn" open-type="share" plain size="mini">
              <uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="36rpx" />
              <text class="share-btn-text">分享</text>
            </button>
          </view>
          <!-- #endif -->
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    data: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    // 分享
    async onShare(e) {
      console.log('onShare', e);
    },
    // 咨询
    async onContact(e) {
      console.log('onContact', e);
    }
  }
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
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 24rpx;
    font-size: $subtitle-size;

    .person {
      margin-left: 20rpx;
      color: #777;
      font-size: $font-size-sm;
    }
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 16rpx;
    font-size: $text-size;

    .left {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: $font-size-sm;

      .now-price {
        font-size: $font-size-md;
        color: #f0ad4e;
      }

      .origin-price {
        margin-left: 10rpx;
        color: #777;
        text-decoration-line: line-through;
      }
    }

    .right {
      display: flex;
      flex-direction: row;
      align-items: center;
      color: #777;

      &-col {
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: $font-size-sm;

        .share-btn {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          line-height: normal;
          color: #777;
          border: none;

          .share-btn-text {
            font-size: $font-size-sm;
            line-height: calc(1.5 * $font-size-sm);
          }
        }
      }
    }

    .staff {
      margin-left: 10rpx;
    }
  }
}

.card-type-pane {
  border-top: $logan-border-spacing-md;
}
</style>