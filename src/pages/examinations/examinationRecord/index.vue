<template>
  <view class="examination-record">
    <custom-header :title="defaultTitle" backgroundColor="transparent"></custom-header>

    <image class="b-img" src="../static/mock-background.png"></image>
    <view class="examination-record-content">
      <template v-if="list.length">
        <view class="record-list-item" v-for="item in list" :key="item.id">
          <view class="record-info" @click="() => toAnswer(item)">
            <view class="record-info-title">
              <uni-icons custom-prefix="iconfont" type="icon-jilu" size="28rpx" />
              <view class="title van-ellipsis">{{ item.title }}</view>
            </view>
            <view class="record-info-date">
              <text class="date">{{ item.create_time }}</text>
              <text class="num">题目数量：{{ item.total_question_num }}</text>
              <text>得分：<text class="number">{{ item.score }}</text></text>
            </view>
          </view>
          <view>
            <uni-icons custom-prefix="iconfont" type="icon-pagenext" color="#ddd" size="28rpx"></uni-icons>
          </view>
        </view>
      </template>
      <NoData top="35%" v-else>暂无考试记录</NoData>
    </view>
  </view>
</template>

<script>
import NoData from "@/components/noData";
import CustomHeader from "@/components/custom-header"
import { browser } from '@/mixins/index'
import { mockExamList } from "@/api/question";

export default {
  name: "examinationRecord",
  mixins: [browser],
  components: {
    NoData,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '考试记录',
      list: [],
      total: 0,
      page: 1,
      question_bank_id: 0,
      source: 'examRecord',
      isOnload: false,
    };
  },
  onLoad() {
    this.getMockExamHistory()
  },

  onShow() {
    if (this.isOnload) {
        this.getMockExamHistory()
    } else {
      this.isOnload = true
    }   
  },
  methods: {
    async toAnswer({ id, title }) {
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let url = `/pages/examinations/answerResult/index`
      let query = `?exam_log_id=${id}&question_bank_id=${question_bank_id}&source=${this.source}&model=3&title=${title}`
      uni.navigateTo({ url: url + query })
    },

    async getMockExamHistory() {
      let question_bank_id = this.$store.getters.questionBankInfo.id      
      const data = {question_bank_id:question_bank_id};
      const res = await mockExamList(data);
      if (res.code === 0) {
        this.list = res.data
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
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 20rpx 0;
      &:active {
        opacity: 0.8;
      }
      .record-info {
        overflow: hidden;
        &-title {
          align-items: center;
          color: #666;
          display: flex;
          .title {
            margin-left: 20rpx;
          }
        }
        &-date {
          margin-top: 24rpx;
          align-items: center;
          color: #cccccc;
          font-size: 24rpx;
          .date {
            margin-left: 46rpx;
            margin-right: 20rpx;
          }
          .num {
            margin-left: 20rpx;
            margin-right: 40rpx;
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