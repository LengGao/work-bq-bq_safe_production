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
        <uni-list-item v-for="item in list" :key="item.id" :title="item.title" :to="item.url" clickable showArrow @click="() => toDetails(item.id)"></uni-list-item>
      </uni-list>
    </view>

    <view class="footer">
      <button @click="onClick" type="primary" plain class="footer-btn">我要反馈</button>
    </view>

  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { problemList } from '@/api/user'
import { getLocation } from '@/api/index'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '意见反馈',
      list: []
    }
  },
  onLoad(options) {
    this.checkRegion()
  },
  methods: {
    toDetails(id) {
      let url = `/pages/users/FAQPage/index`,
          query = `?article_id=${id}`
      uni.navigateTo({ url: url + query })
    },
    onClick() {
      uni.navigateTo({ url: '/pages/users/feedbackSubmit/index' })
    },
    checkRegion() {
      let region_id = this.$store.getters.region.id
      if (region_id) {
        this.problemList(region_id)
      } else {
        this.getLocation()
      }
    },
    async problemList(region_id) {
      let res = await problemList({ region_id: region_id})
      if (res.code === 0) {
        this.list = res.data
      }
    },
    async getLocation() {
      let res = await getLocation()
      if (res.code === 0) {
        this.problemList(res.data.id)
      }
    }
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