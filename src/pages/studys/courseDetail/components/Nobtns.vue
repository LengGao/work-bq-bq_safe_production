<template>
  <view class="nobtns">
    <view class="card">
      <view class="title"> {{data.title | empty }} </view>
      <view class="subtitle">
        {{ data.chapter_count | empty }}章
        {{ data.lesson_count | empty }}课时  
        <text decode>  |  共{{ timeTotal }}学时</text>
      </view>
      <view class="fotter">
        <view class="left">
          <!-- <uni-icons customPrefix="iconfont" type="icon-account-fill" size="48rpx" color="#199fff" /> -->
          <view class="avator">
            <image class="avator-img" :src="data.teacher.avatar" mode="aspectFill" />
          </view>
          <view class="staff">
            {{ data.teacher.name }}
            <text style="margin: 0 30rpx;">|</text>
            <text class="staff-text"> {{ data.learn_count }}人在学</text>
          </view>
        </view>
        <view class="right">
          <text class="right-text">￥{{ data.price }}</text>
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
      required: true,
      default: () => ({})
    }
  },
  computed: {
    timeTotal() {
      return Math.imul(this.data.chapter_count, this.data.lesson_count)
    }
  },
  created() {
    console.log('this.data', this.data);
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

      .avator {
        overflow: hidden;;
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        &-img{
          width: 100%;
          height: 100%;
        }
      }

      .staff {
        display: flex;
        flex-direction: row;
        margin-left: 16rpx;
        color: #777;
        font-size: $text-size;

        &-text {
          color: #199fff;
          font-size: $text-size;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
      &-text {
        font-size: $title-size;
        color: $text-color-price;
      }
    }
  }
}

.card-type-pane {
  border-top: $logan-border-spacing-md;
}
</style>