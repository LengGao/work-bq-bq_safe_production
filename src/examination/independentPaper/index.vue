<template>
  <view class="independent-paper">
    <view class="independent-paper-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="20"></uni-icons>
        <text class="nav-bar-title">自主出题</text>
      </view>
    </view>
    <image class="b-img" src="../../static/autonomy-background.png"></image>
    <scroll-view scroll-y class="independent-paper-content" @scrolltolower="onScrolltolower">
      <view class="question-list" v-if="list.length">
        <view class="question-list-item" v-for="item in list" :key="item.id" @click="toConfig(item.id)">
          <view class="question-info">
            <view class="question-info-title">
              <uni-icons custom-prefix="iconfont" type="icon-linianzhenti" size="28rpx">
              </uni-icons>
              <view class="title van-ellipsis">{{ item.chapter_name }}</view>
            </view>
            <view class="question-info-date">
              <text class="date">{{ item.create_time }}</text>
              <text><text class="number">{{ item.people_num }}</text>人做过</text>
            </view>
          </view>
          <view>
            <uni-icons custom-prefix="iconfont" type="icon-pagenext" color="#ddd" size="28rpx"></uni-icons>
          </view>
        </view>
      </view>
      <NoData top="35%" v-else />
    </scroll-view>
  </view>
</template>
<script>
import { getRealTestPapers } from "@/api/question";
import NoData from "@/components/noData";
export default {
  name: "independentPaper",
  components: {
    NoData,
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      isOnload: false,
    };
  },
  onShow() {
    !this.isOnload &&
      setTimeout(() => {
        this.getRealTestPapers();
      }, 1000);
    this.isOnload = false;
  },
  onLoad() {
    this.getRealTestPapers();
    this.isOnload = true;
  },
  methods: {
    goBack() {
      uni.navigateBack()
    },
    toConfig(chapterId) {
      uni.navigateTo({
        url: `/examination/testPaperIntroduce/index?type=2&chapterId=${chapterId}`,
      });
    },
    onScrolltolower() {
      if (this.list.length < this.total) {
        this.page++;
        this.getRealTestPapers();
      }
    },
    async getRealTestPapers() {
      const data = {
        page: this.page,
      };
      const res = await getRealTestPapers(data);
      if (this.page === 1) {
        this.list = res.data.list;
        this.total = res.data.total;
      } else {
        this.list = this.list.concat(res.data.list);
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
      height: 44px;
      font-size: $uni-font-size-base;
      display: flex;
      align-items: center;
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
  .question-list {
    border-radius: 16rpx;
    padding: 20rpx 30rpx;
    &-item {
      border-bottom: 1rpx solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      &:active {
        opacity: 0.8;
      }
      .question-info {
        overflow: hidden;
        &-title {
          color: #666;
          display: flex;
          align-items: center;
          .title {
            margin-left: 20rpx;
          }
        }
        &-date {
          display: flex;
          align-items: center;
          color: #cccccc;
          font-size: 24rpx;
          .date {
            margin-left: 54rpx;
            margin-right: 20rpx;
          }
          .number {
            color: $uni-color-primary;
          }
        }
      }
    }
  }
}
</style>