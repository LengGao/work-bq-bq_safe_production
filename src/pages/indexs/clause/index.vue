<template>
  <view class="clause">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="clause-title">
      <uParse :content="agreement_subject" />
    </view>
    <view class="clause-content">
      <uParse :content="agreement_detail" />
    </view>

    <button class="btn-read" @click="onRead">我已知悉</button>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import uParse from "@/components/gaoyia-parse/parse.vue";
import { agreement } from '@/api/user'

export default {
  components: {
    CustomHeader,
    uParse
  },
  data() {
    return {
      defaultTitle: '安培学堂',
      agreement_subject: '--',
      agreement_detail: '--',
    }
  },
  onLoad() {
    this.getAgreement()
  },
  methods: {
    onRead() {
      uni.redirectTo({ url: '/pages/login/index?isRead=1' })
    },
    async getAgreement() {
      let res = await agreement()
      if (res.code === 0) {
        this.agreement_subject = res.data.agreement_subject
        this.agreement_detail = res.data.agreement_detail
      }
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.clause {
  width: 100%;
  overflow: hidden;

  &-title {
    padding: 30rpx;
    text-align: center;
    font-size: 48rpx;
    line-height: 96rpx;
    font-weight: bold;
  }

  &-content {
    padding: 0 30rpx;
    font-size: 28rpx;
    line-height: 56rpx;
  }
}

.btn-read {
  margin-top: 60rpx;
  margin-bottom: calc(30rpx + var(--window-bottom));
  width: 80%;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 2px;
  color: #199fff;
  border: 2rpx solid #199fff;
  background-color: transparent;
}
</style>