<template>
  <view class="favorites">
    <view class="favorites-list-item" v-for="item in list" :key="item.id">
      <view class="title">{{ item.title }}（{{ item.num }}）</view>
      <view class="actions">
        <view class="btn-primary plain" @click="toAnswer(1, item.id, item.title)">背题</view>
        <view class="btn-primary" @click="toAnswer(0, item.id, item.title)">重练</view>
      </view>
    </view>
  </view>
</template>
<script>

import { collectChapterList, restartPractice } from "@/api/question";
export default {

  name: "favorites",
  data() {
    return {
      list: [],
    };
  },
  onShow() {
    this.collectChapterList()
  },
  methods: {
    toAnswer(isAnalysis, chapterId, title) {
      let url = ``
      let query = `?chapterId=${chapterId}&title=${title}`
      if (isAnalysis) {
        url = `/pages/examinations/wrongMode/analysis/index`
        uni.navigateTo({ url: url + query })
      } else {
        url = `/pages/examinations/wrongMode/answer/index`
        let questionBankInfo = this.$store.getters.questionBankInfo
        let params = { chapter_id: chapterId, question_bank_id: questionBankInfo.id }
        restartPractice(params).then(res => {
          if (res.code === 0) uni.navigateTo({ url: url + query });
        })
      }
    },
    async collectChapterList() {
      let questionBankInfo = this.$store.getters.questionBankInfo
      let params = { question_bank_id: questionBankInfo.id }
      let res = await collectChapterList(params)
      if (res.code === 0) {
        this.list = res.data
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.favorites {
  height: 100%;
  .favorites-list {
    height: 100%;
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