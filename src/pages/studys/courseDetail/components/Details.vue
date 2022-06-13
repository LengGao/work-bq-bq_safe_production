<template>
  <view class="detail">
    <view class="course-info">
      <view class="header">
        <view class="header-info">
          <view class="title"> {{info.title | empty }}</view>
          <view class="subtitle">
            {{ info.chapter_count | empty }}章
            {{ info.lesson_count | empty }}课时
            <text decode> | 共{{ timeTotal }}学时</text>
          </view>
        </view>

        <view class="header-btns">
          <button class="btn-kefu" @click="courseFavorites" plain>
            <uni-icons v-if="info.favorites" custom-prefix="iconfont" type="icon-shoucangfill" size="36rpx"
                       color="#199fff" />
            <uni-icons v-else custom-prefix="iconfont" type="icon-shoucang2" size="36rpx" color="#ccc" />
            <text class="btn-text">{{ info.favorites ? '取消' : '收藏'}} </text>
          </button>
          <!-- <button class="btn-share" v-if="isMiniapp" @click="onShare" open-type="share" plain>
            <uni-icons custom-prefix="iconfont" type="icon-fenxiang" size="36rpx" />
            <text class="btn-text">分享</text>
          </button> -->
        </view>

      </view>

      <view class="fotter">
        <view class="left">
          <view class="avator">
            <image v-if="info.teacher && info.teacher.avatar" class="avator-img" :src="info.teacher.avatar" mode="aspectFill" />
            <image v-else class="avator-img" :src="Avator" mode="aspectFill" style="background: #199fff;"/>
          </view>
          <view class="staff">
            {{ info.teacher && info.teacher.name ? info.teacher.name : '--' }}
            <text style="margin: 0 30rpx;">|</text>
            <text class="staff-text"> {{ info.learn_count || 0 }}人在学</text>
          </view>
        </view>
        <view class="right">
          <text class="right-text">￥{{ info.price || 0 }}</text>
        </view>
      </view>
    </view>

    <view class="course-rich">
      <u-parse v-if="info.content" class="content" :content="info.content" />
    </view>

    <!-- <view class="footer">
      <button class="footer-btn" @click="onClick">开始学习</button>
    </view> -->
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import { browser } from '@/mixins/index'
import Avator from '@/static/img/user_avator.png'
import { courseFavorites } from '@/api/course'
// #ifdef H5
// import { share_WeixinJSBridge } from '@/utils/api'
// #endif


export default {
  mixins: [browser],
  components: {
    uParse
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    courseId: {
      type: [String, Number],
      default: ''
    },
    needLogin: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      Avator
    }
  },
  computed: {
    timeTotal() {
      return Math.imul(this.info.chapter_count, this.info.lesson_count)
    }
  },
  mounted() {
    console.log('this.info',this.info);
  },
  methods: {
    onClick() {
      this.$emit('start')
    },
    // 分享
    async onShare(e) {
      if (!this.isMiniapp) {
        let params = { course_id: this.courseId, url: location.href }
        share_WeixinJSBridge('https://store.beiqujy.com/apidata/applet/user/share/getShareConfig', params)
      }
    },
    // 咨询
    async courseFavorites(e) {
      let params = { course_id: this.courseId }
      let res = await courseFavorites(params)
      if (res.code === 0) {
        if (res.data.status) {
          uni.showToast({ title: '取消收藏陈功', icon: 'success' })
        } else {
          uni.showToast({ title: '收藏陈功', icon: 'success' })
        }
        this.info.favorites = !!res.data.status
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none'})
      }
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
          font-size: 18rpx;
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
  overflow: hidden;
  line-height: 2;
  box-sizing: border-box;
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