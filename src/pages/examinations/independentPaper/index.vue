<template>
  <view class="independent-paper">
    <view class="independent-paper-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="16px"></uni-icons>
        <text class="nav-bar-title">人工组卷</text>
      </view>
    </view>
    <image class="b-img" src="../static/autonomy-background.png" mode="aspectFill"></image>
    <scroll-view scroll-y class="independent-paper-content" @scrolltolower="onScrolltolower">
        <view class="independent-container" v-if="list.length">
          <view class="independent-list">
            <view class="independent-list-item" v-for="item in list" :key="item.id"
                  @click="toConfig(item)">
              <view class="independent-info">
                <view class="independent-info-title">
                  <uni-icons custom-prefix="iconfont" type="icon-jilu" size="28rpx"></uni-icons>
                  <view class="title van-ellipsis">{{ item.title }}</view>
                </view>
                <view class="independent-info-progress">
                  <view class="item" decode>题数：<text class="text">{{ item.question_num }}</text></view>
                  <view class="item" decode>考试次数：<text class="text">{{ item.used_num }}</text></view>
                  <view class="item" decode>最高得分：<text class="text">{{ item.score }}</text></view>
                </view>
              </view>
              <view class="arrow">
                <uni-icons custom-prefix="iconfont" type="icon-pagenext" color="#ddd" size="28rpx"></uni-icons>
              </view>
            </view>
          </view>
        </view>
      <NoData top="35%" v-else />
    </scroll-view>
  </view>
</template>
<script>
import NoData from "@/components/noData";
import CustomHeader from "@/components/custom-header"
import { customExamList } from "@/api/question";
import { browser } from '@/mixins/index'

export default {
  name: "independentPaper",
  mixins: [browser],
  components: {
    NoData,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '考试简介',
      list: [],
      total: 0,
      page: 1,
      isOnload: false,
    };
  },
  onShow() {
    !this.isOnload && setTimeout(() => { this.getRealTestPapers(); }, 800);
    this.isOnload = false;
  },
  onLoad() {
    this.getRealTestPapers();
    this.isOnload = true;
  },
  methods: {
    goBack() {
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        history.back()
      }
    },
    toConfig(item) {
      let exam_id = item.id
      let url = `/pages/examinations/testPaperIntroduce/index`
      let query = `?exam_id=${exam_id}&source=examAutonomy`
      uni.navigateTo({ url: url + query })
    },
    onScrolltolower() {
    },
    async getRealTestPapers() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_bank_id: questionBankInfo.id }
      const res = await customExamList(params);
      if (res.code === 0) {
        this.list = res.data
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.independent-paper {
  height: 100vh;
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
  &-content {
    height: calc(100% - 460rpx);
    border-radius: 16rpx;
    background-color: #fff;
  }

  .independent-container {
    padding: 30rpx 50rpx;
  }

  .independent-list {
    border-radius: 16rpx;
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
      .independent-info {
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
            min-width: 150rpx;
          }
          .item:nth-of-type(2) {
            min-width: 220rpx;
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