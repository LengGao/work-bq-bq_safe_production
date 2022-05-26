<template>
  <view class="learn-certificate">
    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
        <view class="list-item" v-for="item in certificateData" :key="item.id">
          <view class="list-item-title">{{ item.name }}</view>
          <view class="list-item-time">获取时间：{{ item.time }}</view>
          <view class="list-item-image-box">
            <image class="image" @click="preiviewImg(item.thumb)" :src="item.thumb" mode="aspectFit" />
          </view>
            <view class="list-item-save">长按证书保存</view>
        </view>
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

export default {
  mixins: [MescrollMixin],
  data() {
    const src = '/pages/studys/static/learnCertificate.png'
    // const src = 'https://img0.baidu.com/it/u=4186264322,2530549324&fm=253&fmt=auto&app=138&f=JPG?w=707&h=500'
    return {
      courseData: [],
      certificateData: [
        { id: 1, name: '2022年复工复产线上培训', time: '2022-04-20 21:00:00', thumb: '/pages/studys/static/learnCertificate.png' },
        { id: 2, name: '2021年安全管理员线上培训', time: '2022-04-20 21:00:00', thumb: '/pages/studys/static/learnCertificate.png' }
      ]
    }
  },
  methods: {
    // 预览
    preiviewImg(url) {
      uni.previewImage({ urls: [url] })
    },
    // 初始化
    mescrollInit(e) {
      console.log("mescrollInit", e);
    },
    // 上拉
    async onUp(page) {
      this.pageNum = page.num; // 页码, 默认从1开始
      // const pageSize = page.size; // 页长, 默认每页10条
      const res = await this.getData()
      // 接口返回的当前页数据列表 (数组)
      let curPageData = res.data;
      // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
      let curPageLen = curPageData.length;
      // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
      let totalSize = 30 || res.data.total;
      //设置列表数据
      if (page.num == 1) this.courseData = []; //如果是第一页需手动置空列表
      this.courseData = this.courseData.concat(curPageData); //追加新数据
      // 请求成功,隐藏加载状态
      // 方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      this.mescroll.endBySize(1, 1);
    },
    // 下拉
    async onDown(page) {
      console.log('page2', page);
      this.mescroll.endBySize(1, 1)
    },
    // 数据获取
    getData() {
      let list = []
      return Promise.resolve({ data: list })
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.learn-certificate {
  background-color: $bg-color-grey;
  padding: 30rpx;
}

.list {
  height: 100vh;
  &-item {
    padding: 40rpx 20rpx;
    border-radius: 12rpx;
    background-color: #fff;
    margin-bottom: 40rpx;
    &-title {
      font-size: 30rpx;
      color: #303232;
      display: flex;
      align-items: center;
      &::before {
        content: "";
        width: 8rpx;
        height: 32rpx;
        background-color: $uni-color-primary;
        margin-right: 8rpx;
      }
    }
    &-time {
      padding: 14rpx;
      font-size: $uni-font-size-sm;
      color: #a0a0a0;
    }
    &-image-box {
      text-align: center;
    }
    &-save {
      text-align: center;
      font-size: $uni-font-size-sm;
      color: #a0a0a0;
    }
    &-btn {
      margin-top: 40rpx;
      color: #fff;
      background-color: $color-primary;
      border-radius: 12rpx;
    }
    .image {
      width: 100%;
      height: 446rpx;
    }
  }
}
</style>