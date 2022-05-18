<template>
  <view class="detail">
    <view class="course-info">
      <view class="header">
        <view class="header-info">
          <view class="title"> {{data.title | empty }}</view>
          <view class="subtitle">
            {{ data.chapter_count | empty }}章
            {{ data.lesson_count | empty }}课时
            <text decode> | 共{{ timeTotal }}学时</text>
          </view>
        </view>

        <view class="header-btns" v-if="isMiniapp">
          <button class="btn-kefu" @click="onContact" open-type="contact" plain>
            <uni-icons custom-prefix="iconfont" type="icon-kefu" size="36rpx" />
            <text class="btn-text">咨询</text>
          </button>
          <button class="btn-share" @click="onShare" open-type="share" plain>
            <uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="36rpx" />
            <text class="btn-text">分享</text>
          </button>
        </view>

      </view>

      <view class="fotter">
        <view class="left">
          <view class="avator">
            <image class="avator-img" :src="data.teacher.avatar" mode="aspectFill" />
          </view>
          <view class="staff">
            {{ data.teacher.name | empty }}
            <text style="margin: 0 30rpx;">|</text>
            <text class="staff-text"> {{ data.learn_count || 0 }}人在学</text>
          </view>
        </view>
        <view class="right">
          <text class="right-text">￥{{ data.price || 0 }}</text>
        </view>
      </view>
    </view>

    <view class="course-rich">
      <u-parse v-if="data.content" class="content" :content="data.content" />
    </view>

    <view class="footer">
      <button class="footer-btn" @click="onClick">开始学习</button>
    </view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import { browser } from '@/mixins/index'
// # ifdef H5
// import { share_WeixinJSBridge } from '@/utils/api'
// # endif

export default {
  mixins: [browser],
  components: {
    uParse
  },
  props: {
    data: {
      type: Object,
      default: () => ({})
    },
    courseId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      value: 3,
    }
  },
  mounted() {
    // this.onShare()
  },
  computed: {
    timeTotal() {
      return Math.imul(this.data.chapter_count, this.data.lesson_count)
    }
  },
  methods: {
    onClick() {
      this.$emit('start')
    },
    // 分享
    async onShare(e) {
      if (!this.isMiniapp) {
        let params = { course_id: this.courseId, url: location.href }
        share_WeixinJSBridge( 'https://store.beiqujy.com/apidata/applet/user/share/getShareConfig', params )
      }
    },
    // 咨询
    async onContact(e) {
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.course-info {
  display: flex;
  flex-direction: column;
  padding: 38rpx;

  .header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    .header-info {
      display: flex;
      flex-direction: column;
      word-break: break-all;

      .title {
        font-size: 34rpx;
        font-weight: bold;
      }

      .subtitle {
        margin-top: 24rpx;
        color: #777;
        font-size: 24rpx;
      }
    }

    .header-btns {
      display: flex;
      flex-direction: row;
      align-items: baseline;
      text-align: right;

      .btn-kefu {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0;
        padding: 0;
        line-height: 40rpx;
        color: #777;
        border: none;
      }

      .btn-share {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin: 0 0 0 60rpx;
        padding: 0;
        line-height: 40rpx;
        color: #777;
        border: none;
      }

      .btn-text {
        font-size: $font-size-sm;
        line-height: calc(1.5 * $font-size-sm);
      }
    }
  }

  .fotter {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 36rpx;
    font-size: 24rpx;

    .left {
      display: flex;
      align-items: center;

      .avator {
        overflow: hidden;
        width: 60rpx;
        height: 60rpx;
        border-radius: 50%;
        &-img {
          width: 100%;
          height: 100%;
        }
      }

      .staff {
        display: flex;
        flex-direction: row;
        margin-left: 16rpx;
        color: #777;
        font-size: 24rpx;

        &-text {
          color: #199fff;
          font-size: 24rpx;
        }
      }
    }

    .right {
      display: flex;
      align-items: center;
      margin-left: 20rpx;
      &-text {
        font-size: 34rpx;
        color: $text-color-price;
      }
    }
  }
}

.course-rich {
  border-top: $logan-border-spacing-md;
  padding: 30rpx;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.footer {
  position: fixed;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;

  &-btn {
    width: 80%;
    font-size: 24rpx;
    color: #fff;
    border-radius: 64rpx;
    background-color: #199fff;
  }
}
</style>