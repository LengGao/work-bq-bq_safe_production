<template>
  <view class="clause">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="clause-title">
      <uParse :content="agreement_subject" />
    </view>

    <view class="clause-scroll-box">
      <scroll-view class="clause-scroll" scroll-y>
        <view class="clause-content">
          <uParse :content="agreement_detail" />
        </view>
      </scroll-view>
    </view>

    <view class="footer">
      <button class="btn-read" @click="onRead">我已知悉</button>
    </view>
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
      defaultTitle: '隐私协议',
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
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: hidden;

  &-title {
    padding: 30rpx;
    text-align: center;
    font-size: 48rpx;
    line-height: 96rpx;
    font-weight: bold;
  }

  &-scroll-box {
    width: 100%;
    height: 100vh;
    overflow: hidden;
    margin-bottom: 150rpx;
  }

  &-scroll {
    width: 100%;
    height: 100%;
  }


  &-content {
    padding: 0 30rpx;
    font-size: 28rpx;
    line-height: 2;
  }
}



.footer {
  position: fixed;
  bottom: calc(30rpx + var(--window-bottom));
  width: 100%;
}

.btn-read {
  width: 80%;
  font-size: 32rpx;
  font-weight: 600;
  letter-spacing: 2px;
  color: #199fff;
  border: 2rpx solid #199fff;
  background-color: transparent;
}
</style>