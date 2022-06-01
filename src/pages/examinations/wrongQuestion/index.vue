<template>
  <view class="wrong-question">
    <!-- <uni-notice-bar show-icon text="答对一次后自动移除错题 " /> -->
    <view class="wrong-question-list-item" v-for="item in list" :key="item.id">
      <view class="title">{{ item.title }}（{{ item.num }}）</view>
      <view class="actions">
        <view class="btn-primary plain" @click="toAnswer(1, item.id, item.title)">背题</view>
        <view class="btn-primary" @click="toAnswer(0, item.id, item.title)">重练</view>
      </view>
    </view>
  </view>

</template>

<script>
import { wrongChapterList, restartPractice } from "@/api/question";

export default {
  name: "wrongQuestion",
  data() {
    return {
      list: [],
    }
  },
  onShow() {
    this.wrongChapterList()
  },
  methods: {
    toAnswer(isAnalysis, chapterId, title) {
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let url = ``
      let query = `?chapterId=${chapterId}&question_bank_id=${question_bank_id}&title=${title}&source=wrong&isAnalysis=${isAnalysis}`
      if (isAnalysis) {
        url = `/pages/examinations/selfQuestion/answer/index`
        uni.navigateTo({ url: url + query })
      } else {
        url = `/pages/examinations/selfQuestion/answer/index`
        let params = { chapter_id: chapterId, question_bank_id: question_bank_id }
        restartPractice(params).then(res => {
          if (res.code === 0) uni.navigateTo({ url: url + query });
        })
      }
    },
    async wrongChapterList() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_bank_id: questionBankInfo.id }
      let res = await wrongChapterList(params)
      if (res.code === 0) {
        this.list = res.data
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.wrong-question {
  .wrong-question-list {
    &-item {
      padding: 0 30rpx;
      height: 100rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #eee;
      color: #666;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        .btn-primary {
          color: #fff;
          background-color: $uni-color-primary;
          padding: 2rpx 0 4rpx;
          width: 90rpx;
          text-align: center;
          border-radius: 50rpx;
          font-size: 24rpx;
          &:not(:first-child) {
            margin-left: 20rpx;
          }
          &:active {
            opacity: 0.8;
          }
          &.plain {
            background-color: #fff;
            border: 1px solid $uni-color-primary;
            padding-bottom: 1rpx;
            color: $uni-color-primary;
          }
        }
      }
    }
  }
}
</style>