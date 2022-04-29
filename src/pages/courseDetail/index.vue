<template>
  <view class="course-detail">
    <video :src="video" :autoplay="true" class="course-video"></video>

    <view class="segmented-bar">
      <uni-segmented-control :current="current" :values="items" @clickItem="onChangeSegmented" styleType="text"
                             activeColor="#199fff" />

      <view class="segmented-content">
        <view v-show="current === 0" class="segmented-pane">
          <Details />
        </view>
        <view v-show="current === 1" class="segmented-pane">
          <!-- <Catalogue /> -->
        </view>
        <view v-show="current === 2" class="segmented-pane">
          <Rate />
        </view>
      </view>
    </view>

    <view class="footer">
      <button type="primary" class="footer-btn">开始学习</button>
    </view>
  </view>
</template>

<script>
import Details from './components/Details'
import Catalogue from "./components/Catalogue.vue"
import Rate from './components/Rate'

export default {
  components: {
    Details,
    Catalogue,
    Rate,
  },
  data() {
    return {
      current: 0,
      items: ['选项1', '选项2', '选项3'],
      video: "https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
    }
  },
  methods: {
    // 分段其切换
    onChangeSegmented({ currentIndex }) {
      this.current = currentIndex
    },
    // 获取数据 
    getData() {
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.course-detail {
  padding-bottom: 100rpx;
}

.course-video {
  width: 100%;
  height: 30vh;
}

// .segmented-bar {
// }

.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;

  &-btn {
    width: 80%;
    font-size: $font-size-md;
    line-height: calc(2 * $font-size-md);
    border-radius: 24rpx;
  }
}
</style>