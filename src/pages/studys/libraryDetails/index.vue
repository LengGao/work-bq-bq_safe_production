<template>
  <view class="library-details">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="content">
      <view class="header">
        <view class="title">{{libraryData.title || '--' }}</view>
        <view class="time">{{libraryData.time || '--' }}</view>
      </view>

      <image v-if="libraryData.preview" :src="libraryData.preview" mode="aspectFill" class="img" />
    </view>
    
    <view class="footer">
      <button class="btn__primary" @click="onDownLoad" v-if="libraryData.file_url"> 点击下载 </button>
    </view>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { libraryDetail } from "@/api/index";
import { download_file_common, download_file_h5 } from '@/utils/api'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '资料详情',
      library_id: '',
      libraryData: {},
      open: false,
    }
  },
  onLoad(query) {
    this.library_id = query.library_id
    this.libraryDetail()
  },
  methods: {
    // 点击下载
    onDownLoad() {
      let url = this.libraryData.file_url
      let type = this.libraryData.file_type
      let name = this.libraryData.title
      // #ifdef H5      
      download_file_h5(url, type, name)
      // #endif
    },
    async libraryDetail() {
      let res = await libraryDetail({library_id: this.library_id })
      if (res.code === 0) {
        this.libraryData = res.data
      }
    } 
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.library-details {
  width: 100%;
}

.content {
  height: 100%;
  padding: 20rpx 30rpx;
  text-align: center;

  .header {
    display: flex;
    flex-direction: column;
    width: 100%;
    padding: 30rpx 0;
    border-bottom: 2rpx dashed #c8c7cc;

    .title {
      width: 100%;
      color: #000;
      font-size: 32rpx;
      font-weight: bold;
      text-align: left;
    }

    .time {
      margin-top: 30rpx;
      width: 100%;
      color: #888;
      text-align: left;
      font-size: 24rrpx;
    }
  }

  .img {
    margin-top: 30rpx;
    width: 690rpx;
    height: 690rpx;
  }
}

.footer {
  position: absolute;
  bottom: calc(40rpx + var(--window-bottom));
  left: 0;
  padding: 0 30rpx;
  width: 100%;
  box-sizing: border-box;

  .btn__primary {
    color: #fff;
    background-color: #199fff;
    border-radius: 24rpx;
  }
}
</style>