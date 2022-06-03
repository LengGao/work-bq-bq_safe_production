<template>
  <div class="over-years-introduce">
    <view class="contaienr">
      <image class="b-img" src="../static/introduce-background.png"></image>
      <view class="test-paper-name">{{ configData.title || "" }}</view>
      <view class="desc">
        <text class="desc-title">考试时长：</text>
        <text class="desc-value">{{ configData.duration || 0 }}分钟</text>
      </view>
      <view class="desc">
        <text class="iconfont">&#xe6aa;</text>
        <text class="desc-title">考试总分：</text>
        <text class="desc-value">{{ configData.total_score || 0 }}分</text>
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
        <view v-for="(item, index) in configData.question_type_info" :key="index">
          <text>{{ questionTypes[item.question_type] }}题</text>
          <text>{{ item.question_num }}题，</text>
          <text>一题{{ item.score }}分</text>
        </view>
      </view>
    </view>
    <view class="btns">
      <view class="btn-primary" @click="toAnswer">开始考试</view>
    </view>
  </div>
</template>

<script>
import { getCustomExamInfo, getMockExamInfo, getMockExamLog, createExamLog } from "@/api/question";

export default {
  name: "testPaperIntroduce",
  data() {
    return {
      configData: { list: [] },
      exam_id: 9,
      type: 0,
      source: 'examRandom',
      questionTypes: ['', '单选', '多选', '不定项', '判断', '填空', '简答', '案例'],
    };
  },
  onLoad({ exam_id, type }) {
    this.exam_id = exam_id || ''
    this.type = +type
    this.getConfig();
  },
  methods: {
    async toAnswer() {
      let url = `/pages/examinations/answer/index`
      let query = ``
      let source = this.source
      let exam_id = this.exam_id
      let title = this.configData.title
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let params = {}
      let api = {}

      if (source === 'examRandom') {
        params = {question_bank_id}
        api = getMockExamLog
      } else {
        params = {exam_id, question_bank_id}
        api = createExamLog
      }

      let res = await api(params)
      if (res.code === 0) {
        let exam_log_id = res.data.exam_log_id
        query = `?question_bank_id=${question_bank_id}&exam_log_id=${exam_log_id}&source=${source}&title=${title}`
        uni.redirectTo({ url: url + query })
      }
    },

    async getConfig() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { exam_id: this.exam_id, question_bank_id: questionBankInfo.id }
      let api = !!this.type ? getMockExamInfo : getCustomExamInfo
      const res = await api(params)
      if (res.code === 0) {
        this.configData = res.data
      }
    },
  },
}
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