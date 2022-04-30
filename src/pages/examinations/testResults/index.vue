<template>
  <view class="test-results">
    <view class="results-header">
      <view class="score">
        <image class="score-img" src="../../static/icon-water.png"></image>
        <view class="score-title">最终得分</view>
        <view class="score-value">{{ testResult.info.mark || 0 }}</view>
      </view>
      <view class="topics">
        <view class="topics-number topics-number--success">
          <text class="title">正确题数：</text>
          <text class="number">{{ testResult.info.right_problem || 0 }}</text>
        </view>
        <view class="topics-number topics-number--error">
          <text class="title">错误题数：</text>
          <text class="number">{{ testResult.info.fail_problem || 0 }}</text>
        </view>
        <view class="topics-number topics-number--none">
          <text class="title">未答题数：</text>
          <text class="number">{{ testResult.info.unanswered || 0 }}</text>
        </view>
      </view>
    </view>
    <view class="results-container">
      <block v-for="(item, type) in testResult.list" :key="type">
        <Title>{{ typeMap[type] }}</Title>
        <view class="circular-list">
          <!-- 对案例题特殊处理 -->
          <block v-if="type == 7">
            <block v-for="parent in item" :key="parent.id">
              <Circular @click="goBack(parent.index, index)" v-for="(child, index) in parent.child" :key="child.id"
                        :type="statusMap[child.answer_status]">{{ parent.index }}-{{ index + 1 }}</Circular>
            </block>
          </block>
          <block v-else>
            <Circular @click="goBack(question.index)" v-for="question in item" :key="question.id"
                      :type="statusMap[question.answer_status]">{{ question.index }}</Circular>
          </block>
        </view>
      </block>
    </view>
    <view class="results-footer">
      <view class="btn" @click="goBack">查看全部解析</view>
    </view>
  </view>
</template>
<script>
import Title from "../components/title";
import Circular from "../components/circular";
import { settlement } from "@/api/question";
export default {
  name: "testResults",
  components: {
    Title,
    Circular,
  },
  data() {
    return {
      testResult: {
        info: {},
        list: [],
      },
      statusMap: {
        "-1": "none",
        0: "error",
        1: "success",
      },
      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "判断题",
        4: "不定项题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
    };
  },
  onLoad({ logId }) {
    this.settlement(logId);
  },
  methods: {
    goBack(number, caseIndex) {
      const pages = getCurrentPages(); //获取所有页面栈实例列表
      const prevPage = pages[pages.length - 2]; //上一页页面实例
      const vm = prevPage.$vm;
      // 把选中的赋值
      typeof number === "number" && (vm.currentIndex = number - 1);
      caseIndex && (vm.caseIndex = caseIndex);
      vm.duration = 300;
      uni.navigateBack();
    },
    // 结算成绩
    async settlement(log_id) {
      const data = {
        log_id,
      };
      const res = await settlement(data);
      this.testResult = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.test-results {
  padding: 40rpx;
  padding-bottom: 160rpx;
  .results-header {
    padding: 35rpx 20rpx 35rpx 35rpx;
    border-radius: 16rpx;
    box-shadow: 0 0 10rpx rgba(93, 207, 255, 0.3);
    display: flex;
    margin-bottom: 60rpx;
    .score {
      width: 266rpx;
      height: 230rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      color: #fff;
      &-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      &-title {
        color: $uni-color-primary;
        margin-top: 10rpx;
      }
      &-value {
        font-size: 60rpx;
        margin-bottom: 20rpx;
      }
    }
    .topics {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 20rpx;
      &-number {
        display: flex;
        align-items: center;
        color: #999999;
        font-size: 30rpx;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #e3e3e3;
        .title {
          margin-left: 16rpx;
        }
        &::before {
          content: "";
          width: 32rpx;
          height: 32rpx;
          border-radius: 50%;
        }
        &--success {
          &::before {
            background-color: $uni-answer-success;
          }
          .number {
            color: $uni-answer-success;
          }
        }
        &--error {
          &::before {
            background-color: $uni-answer-error;
          }
          .number {
            color: $uni-answer-error;
          }
        }
        &--none {
          &::before {
            background-color: #ddd;
          }
        }
      }
    }
  }
  .results-container {
    .circular-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .results-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 20rpx;
    border-top: $uni-border;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    .btn {
      color: #fff;
      background-color: $uni-color-primary;
      padding: 10rpx 0;
      width: 300rpx;
      text-align: center;
      border-radius: 10rpx;
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>