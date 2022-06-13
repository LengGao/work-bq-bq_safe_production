<template>
  <view class="library-details">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="content">
      <view class="title">{{libraryData.title}}</view>
      <image v-if="libraryData.preview" :src="libraryData.preview" mode="scaleToFill" class="img" />
    </view>
    
    <view class="footer">
      <button class="btn__primary" @click="onDownLoad"> 点击下载 </button>
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

  .title {
    font-size: 32rpx;
    font-weight: bold;
    height: 96rpx;
    line-height: 96rpx;
    color: #000;
    border-bottom: 2rpx dashed #c8c7cc;
  }

  .img {
    margin-top: 30rpx;
    width: 690rpx;
    height: 690rpx;
  }
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;

  .btn__primary {
    color: #fff;
    background-color: #199fff;
  }
}
</style>