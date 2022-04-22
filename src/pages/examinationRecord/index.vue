<template>
  <view class="examination-record">
    <image class="b-img" src="../../static/mock-background.png"></image>
    <view class="examination-record-content">
      <scroll-view class="record-list" scroll-y @scrolltolower="onScrolltolower">
        <view class="record-title">模拟考试历史记录</view>
        <block v-if="list.length">
          <view class="record-list-item" v-for="item in list" :key="item.id">
            <view class="record-info">
              <view class="record-info-title">
                <uni-icons custom-prefix="iconfont" type="icon-jilu" size="28rpx">
                </uni-icons>
                <view class="title van-ellipsis">{{ item.title }}</view>
              </view>
              <view class="record-info-date">
                <text class="date">{{ item.create_time }}</text>
                <text>得分：<text class="number">{{ item.mark }}</text></text>
              </view>
            </view>
            <view>
              <uni-icons custom-prefix="iconfont" type="icon-pagenext" color="#ddd" size="28rpx"></uni-icons>
            </view>
          </view>
        </block>
        <NoData top="35%" v-else>暂无考试记录</NoData>
      </scroll-view>
    </view>
  </view>
</template>
<script>
import { getMockExamHistory } from "@/api/question";
import NoData from "@/components/noData";
export default {
  name: "examinationRecord",
  components: {
    NoData,
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
    };
  },
  onShow() {
    this.getMockExamHistory();
  },
  methods: {
    onScrolltolower() {
      if (this.list.length < this.total) {
        this.page++;
        this.getMockExamHistory();
      }
    },
    async getMockExamHistory() {
      const data = {
        page: this.page,
      };
      const res = await getMockExamHistory(data);
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
.examination-record {
  height: 100%;
  .b-img {
    position: absolute;
    left: 0;
    top: -30rpx;
    width: 100%;
    height: 450rpx;
    z-index: -1;
  }
  &-content {
    position: relative;
    top: 350rpx;
    left: 0;
    height: calc(100% - 350rpx);
    border-radius: 16rpx;
    background-color: #fff;
  }
  .record-list {
    height: 100%;
    border-radius: 16rpx;
    padding: 20rpx 0;
    background-color: #fff;
    box-sizing: border-box;
    overflow: hidden;
    .record-title {
      color: $uni-color-primary;
      font-weight: bold;
      padding: 34rpx 30rpx;
      border-bottom: 1rpx solid #f5f5f5;
    }
    &-item {
      margin: 0 30rpx;
      border-bottom: 1rpx solid #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      &:active {
        opacity: 0.8;
      }
      .record-info {
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