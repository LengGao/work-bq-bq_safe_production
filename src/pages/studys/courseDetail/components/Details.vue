<template>
  <view class="detail">
    <view class="course-info">
      <view class="header">
        <view class="header-info">
          <view class="title"> {{info.title | empty }}</view>
          <view class="subtitle">
            {{ info.chapter_count | empty }}章
            {{ info.lesson_count | empty }}课时
            <text decode> | 共{{ info.hours_count }}学时</text>
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
          <text class="right-text">{{ info.minute_count || 0 }}分钟</text>
        </view>
      </view>
    </view>

    <view class="course-rich">
      <u-parse v-if="info.content" class="content" :content="info.content" />
    </view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import Avator from '@/static/img/user_avator.png'
import { browser, userStatus } from '@/mixins/index'
import { courseFavorites } from '@/api/course'


export default {
  mixins: [browser, userStatus],
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
  methods: {
    // 咨询
    async courseFavorites(e) {
      if (!this.authority()) { return; }
      let params = { course_id: this.courseId }
      let res = await courseFavorites(params)
      if (res.code === 0) {
        if (res.data.status) {
          uni.showToast({ title: '收藏陈功', icon: 'success' })
        } else {
          uni.showToast({ title: '取消收藏陈功', icon: 'success' })
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
      background-color: #b23145;
      padding: 8rpx 16rpx;

      &-text {
        font-size: 24rpx;
        color: #fff;
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
  text-indent: 2em;
  box-sizing: border-box;

  ::v-deep uni-image {
    margin-left: -2em;
  }
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