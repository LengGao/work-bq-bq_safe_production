<template>
  <view class="feedback">
    <custom-header :title="defaultTitle"></custom-header>
    
    <view class="head">
      <image src="https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/feedback_bg_head.png" mode="aspectFit" class="head-bg_img" />
    </view>

    <view class="list">
      <view class="logan-list-head">
        <view class="logan-list-head-left"> 常见问题 </view>
      </view>
      <uni-list>
        <uni-list-item v-for="item in list" :key="item.id" :title="item.title" :to="item.url" showArrow></uni-list-item>
      </uni-list>
    </view>

    <view class="footer">
      <button @click="onClick" type="primary" plain class="footer-btn">我要反馈</button>
    </view>

  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '意见反馈',
      list: [
        { id: 1, title: '找不到已经购买的课程？', url: "" },
        { id: 2, title: '手机听课出现卡顿怎么办？', url: "" },
        { id: 3, title: '能用电脑上课吗？', url: "" },
        { id: 4, title: '发生退款情况如何处理？', url: "" }
      ]
    }
  },
  methods: {
    onClick() {
      uni.navigateTo({ url: '/pages/users/feedbackSubmit/index' })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.feedback {
  width: 100%;
  overflow: hidden;
}

.popup {
  width: 100%;
  height: 100%;
}

.head {
  padding: 60rpx 30rpx;
  width: calc(750rpx - 60rpx);
  height: 320rpx;
}

.head-bg_img {
  width: 100%;
  height: 100%;
}

.logan-list-head {
  margin-left: 10rpx;
}

.footer {
  text-align: center;
  margin-top: 128rpx;

  &-btn {
    width: 70%;
  }
}
</style>