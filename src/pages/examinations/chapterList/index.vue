<template>
  <view class="chapter">
    <CustomHeader></CustomHeader>
    <image class="b-img" src="../static/chapter-background2.png" mode="aspectFit"></image>
    <view class="chapter-box">
      <scroll-view class="record-list" scroll-y @scrolltolower="onScrolltolower">
        <view class="chapter-container" v-if="chapterList.length">
          <view class="chapter-list">
            <view class="chapter-list-item" v-for="item in chapterList" :key="item.id"
                  @click="toAnswer(item.id, item.chapter_name, item.answer_num,item.topic_num)">
              <view class="chapter-info">
                <view class="chapter-info-title">
                  <uni-icons custom-prefix="iconfont" type="icon-jilu" size="28rpx"></uni-icons>
                  <view class="title van-ellipsis">{{ item.chapter_name }}</view>
                </view>
                <view class="chapter-info-progress">
                  <view class="item" decode>总数：<text class="text">{{ item.topic_num }}</text></view>
                  <view class="item" decode>已做：<text class="text">{{ item.answer_num }}</text></view>
                  <view class="item" decode>正确率：<text class="text">{{ item.correct_rate }}%</text></view>
                </view>
              </view>
              <view class="arrow">
                <uni-icons custom-prefix="iconfont" type="icon-pagenext" color="#ddd" size="28rpx"></uni-icons>
              </view>
            </view>
          </view>
        </view>
        <NoData top="40%" v-else />
      </scroll-view>
    </view>
  </view>
</template>
<script>
import NoData from "@/components/noData";
import CustomHeader from '@/components/custom-header'
import { getChapterList } from "@/api/question";

export default {
  name: "chapter",
  components: {
    NoData,
    CustomHeader
  },
  data() {
    return {
      chapterList: [
        {
          id: 1,
          chapter_name: "第1章 信息化知识", // 章节名称
          topic_num: 100, // 题目总数
          answer_num: 40, // 已答题目数量
          chapters_progress: 0, // 章节进度数值
          completion_rate: 0, // 章节进度
          answer_total_num: 0, // 总答题数
          correct_rate: 80 // 正确率
        },
        {
          id: 2,
          chapter_name: "第二章 低压电工练习二", // 章节名称
          topic_num: 90, // 题目总数
          answer_num: 38, // 已答题目数量
          chapters_progress: 0, // 章节进度数值
          completion_rate: 0, // 章节进度
          answer_total_num: 0, // 总答题数
          correct_rate: 75 // 正确率
        },
        {
          id: 3,
          chapter_name: "第三章 低压电工练习三", // 章节名称
          topic_num: 100, // 题目总数
          answer_num: 40, // 已答题目数量
          chapters_progress: 0, // 章节进度数值
          completion_rate: 0, // 章节进度
          answer_total_num: 0, // 总答题数
          correct_rate: 80 // 正确率
        },
      ],
      statisticalData: {
        completion_rate: 0, // 章节进度
        answer_total_num: 0, // 总答题数
        correct_rate: 0, // 正确率
      },
      isOnload: false,
    };
  },
  onShow() {
    if (!this.isOnload) {
      setTimeout(() => {
        this.getChapterList();
      }, 500);
    }
    this.isOnload = false;
  },
  onLoad() {
    this.getChapterList();
    this.isOnload = true;
  },
  methods: {
    toAnswer(chapterId, title, answer_num, topic_num) {
      let url = '/pages/examinations/answer/index', query = ''
      if (!topic_num) {
        uni.showToast({ title: '当前章节暂未配置题目', icon: 'none' })
        return;
      }
      if (!answer_num) {
        query = `?chapterId=${chapterId}&title=${title}&type=1&isContinue=0`
        uni.navigateTo({ url: url + query });
        return;
      }
      uni.showModal({
        title: '提示',
        content: '检测到您有做题记录',
        cancelText: '重新开始',
        confirmText: '继续上次',
        success: function (res) {
          let isContinue = 1 // 1继续上次 2重新开始
          if (res.cancel) { isContinue = 0 }
          query = `?chapterId=${chapterId}&title=${title}&type=1&isContinue=${isContinue}`
          uni.navigateTo({ url: url + query });
        }
      })
    },
    async getChapterList() {
      // const res = await getChapterList();
      // this.chapterList = res.data.list || [];
      // this.statisticalData = res.data.data || {};
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter {
  width: 100%;
  font-size: $uni-font-size-base;
  .b-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 448rpx;
    z-index: -1;
  }
  &-box {
    margin-top: calc(448rpx - 108rpx);
    width: 100%;
    border-top-left-radius: 16rpx;
    border-top-right-radius: 16rpx;
    background-color: #fff;
    box-sizing: border-box;
  }
  &-container {
    padding: 30rpx 50rpx;
  }
  &-list {
    border-radius: 16rpx;
    // box-shadow: 0 0 10rpx rgba(93, 207, 255, 0.3);
    padding: 40rpx 0 20rpx;
    background-color: #fff;
    &-item {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 20rpx 0;
      border-bottom: 1rpx solid #f5f5f5;
      &:active {
        opacity: 0.8;
      }
      .chapter-info {
        &-title {
          display: flex;
          align-items: center;
          color: #666;
          .title {
            margin-left: 26rpx;
          }
        }
        &-progress {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          margin: 24rpx 0 0 34rpx;
          width: 500rpx;
          color: #888888;
          font-size: $uni-font-size-base;
          .text {
            color: $uni-color-primary;
          }
        }
      }
      .arrow {
        text-align: center;
      }
    }
  }
}
</style>