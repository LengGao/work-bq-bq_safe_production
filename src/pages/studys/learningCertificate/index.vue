<template>
<view class="learning-certificate">
  <custom-header :title="defaultTitle" ></custom-header>

  <view class="main">
    <view class="section">
      <view class="hader">{{ toastTittle }}</view>
      <view class="certificate">
        <image class="certificate-img" :src="downloadUrl" mode="aspectFit" />
      </view>
    </view>
    <view class="footer" v-if="downloadUrl">
      <button class="btn-primary">请长按图片保存 </button>
    </view>
  </view>
</view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { buildLearnCert } from "@/api/course"
export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle:  '学习证书',
      downloadUrl: '',
      course_id: 0,
      toastTittle: '太好啦，您的证书已生成'
    }
  },
  onLoad(options) {
    let { course_id } = options
    this.course_id = +course_id
    this.buildLearnCert()
  },
  methods: {
    async buildLearnCert() {
      let res = await buildLearnCert({course_id :this.course_id})
      if (res.code === 0) {
        this.downloadUrl = res.data.url
      } else {
        this.toastTittle = res.message
        uni.showToast({ title:`${res.message}`, icon: 'none' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.learning-certificate {
  height: 100vh;
}

.main {
  position: relative;
  padding: 60rpx 30rpx;
}

.section {
  height: 100%;

  .hader {
    font-size: 32rpx;
    color: #333;
    text-align: center;
  }

  .certificate {
    height: 50vh;
    display: flex;
    flex-direction: column;
    justify-content: center;

    &-img {
      width: 100%;
      height: 840rpx;
    }
  }
}

  .certificate-img {
    width: 680rpx;
  }

  .footer {
    position: fixed;
    bottom: 60rpx;
    left: 10%;
    width: 80%;
    .btn-primary {
      font-size: 28rpx;
      color: #fff;
      background-color: #199fff;
    }
  }
</style>
