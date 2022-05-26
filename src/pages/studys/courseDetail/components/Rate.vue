<template>
  <view class="rate">
    <view class="rate-all">
      <view class="rate-left">
        <view class="score">{{ star }}</view>
        <view class="rate-all-comments">
          <view class="comments-num">{{ rateCount }}条评论</view>
          <uni-rate :value="star" :size="24" readonly />
        </view>
      </view>
      <view class="right">
        <button @click="onClickComments" class="comments-btn">
          <text style="font-size: 24rpx;">我要评价</text>
        </button>
      </view>
    </view>

    <view class="rate-tag">
      <view v-for="(tag, index) in tags" :key="index" class="tag">
        <text class="tag-text">{{ tag.word }} ({{ tag.count }})</text>
      </view>
    </view>

    <view class="comments">
      <scroll-view scroll-y @scrolltolower="() => upCallback(page)" style="height: 100%">
        <view class="comments-item" v-for="comment in comments" :key="comment.id">
          <view class="comments-userinfo">
            <view class="userinfo-left">
              <image :src="comment.user_avatar" mode="aspectFit" class="avator" @error="(index) => avatorError(index)" />
              <view class="userinfo-left-box">
                <text class="username">
                  {{ comment.user_name }}
                  <text class="status" :class="comment.status ? 'success' : 'warn'">
                    {{ comment.status ? '审核通过' : '审核中'}}
                  </text>
                </text>
                <text class="time">{{comment.create_time}}</text>
              </view>
            </view>
            <view class="userinfo-right">
              <uni-rate :value="comment.star" size="24" readonly />
            </view>
          </view>

          <view class="comments-textarea">
            {{ comment.comment }}
          </view>
        </view>

        <view v-if="isFinish" style="width: 100%; font-size: '24rpx'; text-align: center;"> 没有更多了</view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
import avator from "@/static/img/user_avator.png";
import {
  courseCommentCount,
  courseGetCommentList
} from '@/api/course'

export default {
  props: {
    courseId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      isFinish: false,
      page: { num: 0, size: 1 },
      star: 0,
      rateCount: 0,
      tags: [],
      comments: []
    }
  },
  watch: {
    courseId() {
      this.downCallback()
      this.getCourseCommentCount()
    }
  },
  mounted() {
    this.downCallback()
    this.getCourseCommentCount()
  },
  methods: {
    avatorError(index) {
      this.comments[index].user_avatar = avator
    },
    onClickComments() {
      this.$emit('openComment')
    },
    // 下拉
    downCallback() {
      this.page.num = 0
      this.upCallback(this.page)
    },
    // 上拉
    async upCallback(page) {
      if (this.isFinish) return;
      page.num++;
      const data = {
        page: page.num,
        page_size: page.size,
        course_id: this.courseId
      }
      const res = await courseGetCommentList(data)
      if (res.code !== 0) return page.num -= 1;

      let curPageData = res.data.data
      let totalSize = res.data.total;
      let curPageLen = curPageData.length + this.comments.length
      if (page.num == 1) this.comments = [];
      this.comments = this.comments.concat(curPageData);
      this.endBySize(curPageLen, totalSize);
    },
    // 技术判断
    endBySize(curPageLen, totalSize) {
      if (curPageLen >= totalSize) {
        this.isFinish = true
      } else {
        this.isFinish = false
      }
      return this.isFinish
    },
    // 评论统计
    async getCourseCommentCount() {
      let params = { course_id: this.courseId }
      let res = await courseCommentCount(params)
      if (res.code === 0) {
        this.star = res.data.score
        this.tags = res.data.words
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.rate {
  height: 100%;
}

.rate-all {
  padding: 33rpx;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .rate-left {
    display: flex;
    flex-direction: row;
    align-items: flex-end;

    .score {
      font-size: 64rpx;
      color: #dd524d;
    }

    .rate-all-comments {
      margin-left: 20rpx;
    }

    .comments-num {
      font-size: $font-size-sm;
      line-height: calc(2 * $font-size-sm);
    }
  }

  .right {
    .comments-btn {
      padding-left: 24rpx;
      padding-right: 24rpx;
      font-size: $font-size-sm;
      color: #fff;
      border-radius: 24rpx;
      background-color: #199fff;
    }
  }
}

.rate-tag {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  padding: 0 18rpx 30rpx;

  .tag {
    margin: 10rpx;
    padding: 12rpx;
    color: #777;
    font-size: 24rpx;
    text-align: center;
    border: 2rpx solid rgb(236, 236, 236);
    border-radius: 12rpx;

    &-text {
      font-size: $font-size-sm;
      color: #aaa;
    }
  }
}

.comments {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 500rpx;
  padding-bottom: var(--window-bottom);
  border-top: $logan-border-spacing-md;

  &-item {
    display: flex;
    flex-direction: column;
    padding: 30rpx;
    width: calc(100% - 60rpx);
    border-bottom: $logan-border-spacing-md-sm;
  }

  &-userinfo {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;

    .userinfo-left {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: $font-size-sm;

      .avator {
        width: $img-size-sm;
        height: $img-size-sm;
        border-radius: 50%;
      }
    }

    .userinfo-left-box {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 20rpx;

      .username {
        font-size: $font-size-sm;
      }

      .time {
        margin-top: 24rpx;
        color: #aaa;
        font-size: $font-size-sm;
      }

      .status {
        margin-left: 20rpx;
        font-size: $font-size-sm;
        padding: 2rpx 6rpx 4rpx;
      }

      .success {
        color: $color-primary;
        border: 2rpx solid $color-primary;
      }

      .warn {
        color: $color-error;
        border: 2rpx solid $color-error;
      }
    }
  }

  &-textarea {
    margin-top: 20rpx;
    margin-left: 116rpx;
    font-size: $font-size-base;
    word-break: break-all;
  }
}
</style>