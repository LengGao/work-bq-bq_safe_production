<template>
  <div class="over-years-introduce">
    <view class="contaienr">
      <image class="b-img" src="../static/introduce-background.png"></image>
      <view class="test-paper-name">{{ configData.title || "" }}</view>
      <view class="desc">
        <text class="iconfont">&#xe602;</text>
        <text class="desc-title">考试时长：</text>
        <text class="desc-value">{{ configData.duration || 0 }}分钟</text>
      </view>
      <view class="desc">
        <text class="iconfont">&#xe6aa;</text>
        <text class="desc-title">考试总分：</text>
        <text class="desc-value">{{ configData.score || 0 }}分</text>
      </view>
      <view class="desc">
        <text class="iconfont">&#xe6e5;</text>
        <text class="desc-title">及格分数：</text>
        <text class="desc-value">{{ configData.pass_score || 0 }}分</text>
      </view>
      <view class="desc">
        <text class="iconfont">&#xe61b;</text>
        <text class="desc-title">题型分布：</text>
      </view>
      <view class="question-type">
        <view v-for="(item, index) in configData.list" :key="index">{{
          item
        }}</view>
      </view>
    </view>
    <view class="btns">
      <block v-if="type === '1'">
        <view class="btn-primary" @click="toTestAnswer">开始考试</view>
      </block>

      <block v-if="type === '2'">
        <view class="btn-primary plain" @click="toOverYearAnswer">刷题模式</view>
        <view class="btn-primary" @click="toOverYearTestAnswer">考试模式</view>
      </block>
      <block v-if="type === '3'">
        <view class="btn-primary" @click="toAutonomyTestAnswer">开始考试</view>
      </block>
    </view>
  </div>
</template>
<script>
import {
  testExamConfig,
  getOverYearConfig,
  getIndependentConfig,
} from "@/api/question";
export default {
  name: "testPaperIntroduce",
  data() {
    return {
      configData: {
        list: [],
      },
      type: "",
      chapterId: "",
    };
  },
  onLoad({ type, chapterId }) {
    this.type = type;
    this.chapterId = chapterId;
    this.getConfig(chapterId);
  },
  methods: {
    toAutonomyTestAnswer() {
      uni.navigateTo({
        url: `/pages/examinations/answer/index?type=4&title=${this.configData.title
          }&chapterId=${this.chapterId}&time=${this.configData.duration * 60
          }`,
      });
    },
    toOverYearAnswer() {
      uni.navigateTo({
        url: `/pages/examinations/answer/index?type=3&isExam=0&chapterId=${this.chapterId
          }&title=${this.configData.title}&time=${this.configData.duration * 60
          }`,
      });
    },
    toOverYearTestAnswer() {
      uni.navigateTo({
        url: `/pages/examinations/answer/index?type=3&isExam=1&chapterId=${this.chapterId
          }&title=${this.configData.title}&time=${this.configData.duration * 60
          }`,
      });
    },
    toTestAnswer() {
      uni.navigateTo({
        url: `/pages/examinations/answer/index?type=2&title=${this.configData.title}&time=${this.configData.duration * 60
          }`,
      });
    },
    async getConfig(chapter_id) {
      const data = {
        chapter_id,
      };
      const api = {
        1: testExamConfig, // 模拟考试
        2: getOverYearConfig, // 历年真题
        3: getIndependentConfig, // 历年真题
      };
      const res = await api[this.type](data);
      this.configData = res.data;
    },
  },
};
</script>
<style lang="scss" scoped>
.over-years-introduce {
  padding: 30rpx 32rpx 0 28rpx;
  .contaienr {
    position: relative;
    min-height: 800rpx;
    padding: 50rpx;
    .b-img {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
    }
    .test-paper-name {
      padding: 34rpx 0 25rpx;
      font-size: 32rpx;
      color: $uni-color-primary;
      border-bottom: $uni-border;
      font-weight: bold;
    }
    .desc {
      font-size: 28rpx;
      display: flex;
      align-items: center;
      padding: 17rpx 0;
      &-title {
        color: #666;
        margin-left: 14rpx;
      }
      &-value {
        color: $uni-color-primary;
      }
    }
    .question-type {
      padding-left: 46rpx;
      color: $uni-color-primary;
      font-size: 28rpx;
      line-height: 70rpx;
    }
  }
  .btns {
    margin-top: 100rpx;
    display: flex;
    align-items: center;
    justify-content: center;
    .btn-primary {
      color: #fff;
      background-color: $uni-color-primary;
      padding: 16rpx 0;
      width: 270rpx;
      text-align: center;
      border-radius: 50rpx;
      font-size: 36rpx;
      &:not(:first-child) {
        margin-left: 20rpx;
      }
      &:active {
        opacity: 0.8;
      }
      &.plain {
        background-color: #fff;
        border: 1px solid $uni-color-primary;
        padding: 14rpx 0;
        color: $uni-color-primary;
      }
    }
  }
}
</style>