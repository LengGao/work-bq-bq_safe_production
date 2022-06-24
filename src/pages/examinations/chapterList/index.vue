<template>
  <view class="chapter">
    <view class="chapter-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="16px"></uni-icons>
        <text class="nav-bar-title">章节练习</text>
      </view>
    </view>

    <image class="b-img" :src="bgImg" mode="aspectFill"></image>
    <view class="chapter-box">
      <scroll-view class="record-list" scroll-y @scrolltolower="onScrolltolower">
        <view class="chapter-container" v-if="chapterList.length">
          <view class="chapter-list">
            <view class="chapter-list-item" v-for="item in chapterList" :key="item.id"
                  @click="toAnswer(item)">
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
import bgImg from '../static/chapter_background2.png'
import { browser } from '@/mixins/index'

export default {
  name: "chapter",
  mixins: [browser],
  components: {
    NoData,
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '章节练习',
      chapterList: [],
      question_bank_id: '',
      question_id: '',
      last_question_id: 0,
      source: 'chapter',
      isOnload: false,
      bgImg: bgImg,
    };
  },
  onLoad() {
    this.getChapterList();
  },
  onShow() {
    if (this.isOnload) {
      this.getChapterList()
    } else {
      this.isOnload = true
    }
  },
  methods: {
    toAnswer({id, title, question_bank_id, last_question_id, is_answer, question_count }) {
      let url = '/pages/examinations/answer/index', query = ''
      let source = this.source

      const cancelCallback = () => {
          query = `?chapter_id=${id}&question_bank_id=${question_bank_id}&source=${source}&title=${title}`
          restartPractice({ chapter_id: id, question_bank_id }).then(res => {
            if (res.code === 0) uni.navigateTo({ url: url + query })
          })
      }
      
      const confirmCallback = () => {
        query = `?chapter_id=${id}&question_bank_id=${question_bank_id}&last_question_id=${last_question_id}&source=${source}&title=${title}`
        uni.navigateTo({ url: url + query });
      }

      const startCallback = () => {
        query = `?chapter_id=${id}&question_bank_id=${question_bank_id}&source=${source}&title=${title}`
        uni.navigateTo({ url: url + query });
      }

      const analysisCallback = () => {
        query = `?chapter_id=${id}&question_bank_id=${question_bank_id}&source=${source}&title=${title}&model=3&restart=1`
        uni.navigateTo({ url: url + query });
      }

      if (!question_count) { 
        uni.showToast({ title: '当前章节暂未配置题目', icon: 'none' })
      } else if (is_answer == 0) {
        startCallback()
      } else if (is_answer == 1) {
        confirmCallback()
      } else if (is_answer == 2) {
        uni.showModal({
          title: '提示',
          content: '您已完成本章节的练习，是否重新练习?',
          showCancel: true,
          cancelText: '查看解析',
          confirmText: '重新练习',
          success: ({ confirm, cancel }) => {
            if (confirm) {
              cancelCallback()
            } else if (cancel) {
              analysisCallback()
            }
          }
        })
      }
    },
    goBack() {
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        history.back()
      }
    },

    async getChapterList() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_bank_id: questionBankInfo.id }

      const res = await getChapterList(params);
      if (res.code === 0) {
        this.question_bank_id = params.question_bank_id
        this.chapterList = res.data
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chapter {
  height: 100%;
  width: 100%;
  font-size: $uni-font-size-base;

  &-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    .status_bar {
      height: var(--status-bar-height);
      width: 100%;
    }
    .nav-bar {
      display: flex;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
      &-back {
        padding: 0 20rpx;
      }
      &-title {
        padding-right: 60rpx;
        margin: 0 auto;
      }
    }
  }
  .b-img {
    width: 100%;
    height: 450rpx;
    z-index: -1;
  }
  &-box {
    height: calc(100% - 460rpx);
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
          margin-top: 24rpx;
          color: #888888;
          font-size: $uni-font-size-base;
          .item {
            min-width: 230rpx;
          }
          .item:nth-of-type(1) {
            min-width: 180rpx;
          }
          .item:nth-of-type(2) {
            min-width: 190rpx;
          }
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