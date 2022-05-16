<template>
  <view class="rate">
    <view class="rate-all">
      <view class="rate-left">
        <view class="score">{{ value }}</view>
        <view class="rate-all-comments">
          <view class="comments-num">36条贫家</view>
          <uni-rate v-model="value" @change="onChange" size="48rpx" allowHalf readonly />
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
        <text class="tag-text">{{ tag.text }} ({{ tag.num }})</text>
      </view>
    </view>

    <view class="comments" style="height: 400px">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" 
      :fixed="false" style="overflow: auto" height="400px">
        <view class="comments-item" v-for="comment in comments" :key="comment.id">
          <view class="comments-user">
            <image :src="comment.user_avatar | avatorFormat" mode="aspectFit" class="avator" />
          </view>
          <view class="comments-content">
            <text class="username">
              {{ comment.user_name }}
              <text class="status" :class="comment.status ? 'success' : 'warn'">
                {{ comment.status ? '审核通过' : '审核中'}}
              </text>
            </text>
            <text class="content-time">{{comment.create_time}}</text>
            <text class="content">{{ comment.comment }}</text>
          </view>
          <view class="comments-rate">
            <view class="rate">
              <uni-rate :value="comment.star" size="36rpx" readonly />
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>

  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import MescrollBody  from "@/uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue"
import {
  courseGetCommentList
} from '@/api/course'

export default {
  mixins: [MescrollMixin],
  components: {
    MescrollBody
  },
  props: {
    courseId: {
      type: [String, Number],
      default: ''
    }
  },
  data() {
    return {
      show: false,
      up: {
        page: {
          num: 0,
          size: 1,
          time: 500
        }
      },
      value: 2,
      rateForm: {
        tags: [],
        star: 0,
        remark: '',
      },
      tags: [
        { text: '刀剑神域', num: 11 },
        { text: 'overlord', num: 10 },
        { text: '从零开始的异世界生活', num: 12 },
        { text: 'overlord', num: 10 },
      ],
      comments: []
    }
  },
  mounted() {
  },
  methods: {
    onClickComments() {
      this.$emit('openComment')
    },
    // 下拉
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    // 上拉
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        course_id: this.courseId
      }
      const res = await courseGetCommentList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      // 接口返回的当前页数据列表 (数组)
      let curPageData = res.data.data
      // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
      let curPageLen = curPageData.length;
      // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
      let totalSize = res.data.total;
      //设置列表数据
      if (page.num == 1) this.comments = []; //如果是第一页需手动置空列表
      this.comments = this.comments.concat(curPageData); //追加新数据
      // 请求成功,隐藏加载状态 方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      this.mescroll.endBySize(curPageLen, totalSize);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

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
      color: #777;
    }
  }
}

.comments {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  border-top: $logan-border-spacing-md;

  &-item {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: flex-start;
    padding: 24rpx 30rpx;
    width: calc(100% - 60rpx);
    border-top: $logan-border-spacing-md-sm;
  }

  &-user {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    flex: 1;
  }

  &-content {
    display: flex;
    flex-direction: column;
    margin: 0 30rpx;
    font-size: $font-size-sm;
    color: $text-color;
    flex: 4;

    .content {
      margin-top: 20rpx;
    }
  }

  &-rate {
    display: flex;
    flex-direction: columns;
    align-items: center;
    color: $text-color-grey;
  }

  .avator {
    width: $img-size-sm;
    height: $img-size-sm;
    border-radius: 50%;
  }

  .content-time {
    margin-top: 12rpx;
    font-size: $font-size-sm;
  }
}
</style>