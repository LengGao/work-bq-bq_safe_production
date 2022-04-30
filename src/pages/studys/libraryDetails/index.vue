<template>
  <view class="library-details">
    <view class="content">
      <image v-if="imageMIME.includes(File.type)" src="/static/logo.png" mode="scaleToFill" class="img" />
      <view v-if="File.type === 'pdf'" class="file">
        <uni-icons custom-prefix="iconfont" type="icon-file-pdf-fill" size="300rpx" color="#dd524d" />
      </view>
      <view v-else-if="docMIME.includes(File.type)" class="file">
        <uni-icons custom-prefix="iconfont" type="icon-file-pdf-fill" size="300rpx" color="#dd524d" />
      </view>
      <view v-else-if="tableMIME.includes(File.type)" class="file">
        <uni-icons custom-prefix="iconfont" type="icon-file-word-fill" size="300rpx" color="#199fff" />
      </view>
      <view v-else class="file">
        <uni-icons custom-prefix="iconfont" type="icon-file-text" size="300rpx" color="#199fff" />
      </view>
    </view>
    <!-- <object data="/static/a.docx" type="docs"></object> -->

    <view class="footer">
      <button type="primary" @click="onDownLoad"> 点击下载 </button>
    </view>
  </view>
</template>

<script>
import { download_canva_h5, downLoad_link_H5, download_file_miniapp } from '@/utils/api'
export default {
  data() {
    return {
      open: false,
      imageMIME: ['jpg', 'png', 'jpeg', 'gif'],
      docMIME: ['docs', 'doc', 'pdf'],
      tableMIME: ['xlsx', 'xls', 'excel'],
      File: {
        type: 'pdf'
      }
    }
  },
  methods: {
    // 点击下载
    onDownLoad() {
      // let imgsrc = '/static/a.docx'
      let imgsrc = 'http://192.168.8.194:8080/static/logo.png'
      // downLoad_link_H5(imgsrc)
      // download_canva_h5(imgsrc)
      download_file_miniapp(imgsrc)
    },

    send() {

    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.library-details {
  padding: $page-padding;
}

.content {
  height: 100%;
  text-align: center;
}

.img {
  width: 10%;
  height: 100%;
}

.file {
  position: relative;
  top: 25vh;
}

.footer {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
}
</style>