<template>
  <view class="chapter">
    <CustomHeader></CustomHeader>
    <image class="b-img" src="../static/chapter-background2.png" mode="aspectFit"></image>
    <view class="chapter-box">
      <scroll-view class="record-list" scroll-y @scrolltolower="onScrolltolower">
        <view class="chapter-container" v-if="chapterList.length">
          <view class="chapter-list">
            <view class="chapter-list-item" v-for="item in chapterList" :key="item.id"
                  @click="toAnswer(item.id, item.title, item.question_bank_id, item.last_question_id, item.question_count )">
              <view class="chapter-info">
                <view class="chapter-info-title">
                  <uni-icons custom-prefix="iconfont" type="icon-jilu" size="28rpx"></uni-icons>
                  <view class="title van-ellipsis">{{ item.title }}</view>
                </view>
                <view class="chapter-info-progress">
                  <view class="item" decode>总数：<text class="text">{{ item.question_count }}</text></view>
                  <view class="item" decode>已做：<text class="text">{{ item.did_num }}</text></view>
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
import { getChapterList, restartPractice } from "@/api/question";

export default {
  name: "chapter",
  components: {
    NoData,
    CustomHeader
  },
  data() {
    return {
      chapterList: [],
      question_bank_id: '',
      question_id: '',
      last_question_id: 0,
      isOnload: false,
    };
  },
  onLoad() {
    this.getChapterList();
    this.isOnload = true;
  },
  onShow() {
    if (!this.isOnload) {
      setTimeout(() => {
        this.getChapterList();
      }, 500);
    }
    this.isOnload = false;
  },
  methods: {
    toAnswer(chapterId, title, question_bank_id, last_question_id, question_count) {
      let url = '/pages/examinations/practiceMode/answer/index', query = ''
      if (!question_count) {
        uni.showToast({ title: '当前章节暂未配置题目', icon: 'none' })
        return;
      }

      uni.showModal({
        title: '提示',
        content: '检测到您有做题记录',
        cancelText: '重新开始',
        confirmText: '继续上次',
        success: function (res) {
          if (res.cancel) {
            query = `?chapterId=${chapterId}&question_bank_id=${question_bank_id}&title=${title}`
            restartPractice({ question_bank_id, chapter_id: chapterId }).then(res => {
              if (res.code === 0) uni.navigateTo({ url: url + query });
            })
          } else {
            query = `?chapterId=${chapterId}&question_bank_id=${question_bank_id}&title=${title}`
            uni.navigateTo({ url: url + query });
          }
        }
      })
    },

    async getChapterList() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_bank_id: questionBankInfo.id }

      const res = await getChapterList(params);
      if (res.code === 0) {
        this.question_bank_id = params.question_bank_id
        this.chapterList = res.data
      }
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