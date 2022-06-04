<template>
  <view class="favorites">
    <template v-if="list.length">
    <view class="favorites-list-item" v-for="item in list" :key="item.id">
      <view class="title">{{ item.title }}（{{ item.num }}）</view>
      <view class="actions">
        <view class="btn-primary plain" @click="toAnswer(1, item.id, item.title)">背题</view>
        <view class="btn-primary" @click="toAnswer(0, item.id, item.title)">重练</view>
      </view>
    </view>
    </template>
    <NoData top="35%" v-else>暂无考试记录</NoData>
  </view>
</template>
<script>

import NoData from "@/components/noData/index";
import { collectChapterList, restartPractice } from "@/api/question";
export default {
  name: "favorites",
  components: {
    NoData
  },
  data() {
    return {
      list: [],
      isOnload: false,
    };
  },
  onLoad() {
    this.collectChapterList()
    this.isOnload = true
  },
  onShow() {
    if (!this.isOnload) {
      setTimeout(() => { 
        this.collectChapterList()
      }, 800)
    }
    this.isOnload = false
  },
  methods: {
    getPath(url, query) {
      let params = ''
      Object.keys(query).forEach((key) => { params += `&${key}=${query[key]}` })
      params = params.replace(/&?/, '?')
      return url + params
    },

    async toAnswer(type, chapter_id, title) {
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let url = `/pages/examinations/answer/index`
      let source = !!type ? 'memoryFavorites' : 'favorites'
      let query = { chapter_id, question_bank_id, source, title }
      let path = this.getPath(url, query)
      let params = {chapter_id, question_bank_id}
      let res = await restartPractice(params)
      if (res.code === 0) uni.navigateTo({ url: path })
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