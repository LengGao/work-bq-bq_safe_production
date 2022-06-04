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
    
    <view class="footer">
      <button class="btn__primary" @click="onDownLoad"> 点击下载 </button>
    </view>
  </view>
</template>

<script>
import { libraryDetail } from "@/api/index";
import { download_file_common } from '@/utils/api'

export default {
  data() {
    return {
      library_id: '',
      region_id: '',
      libraryData: {},
      open: false,
      imageMIME: ['jpg', 'png', 'jpeg', 'gif'],
      docMIME: ['docs', 'doc', 'pdf'],
      tableMIME: ['xlsx', 'xls', 'excel'],
      File: {
        type: 'pdf'
      }
    }
  },
  onLoad(query) {
    this.library_id = query.library_id
    this.region_id = this.$store.getters.region.id
    this.libraryDetail()
  },
  methods: {
    // 点击下载
    onDownLoad() {
      let docxFile = 'http://192.168.8.194:8080/pages/studys/static/a.docx'
      let imgFile = 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/index_swiper.png'
      download_file_common(docxFile, 'a.docx')
    },
    async libraryDetail() {
      let region_id = this.region_id
      let page = 1
      let pageSize = 10
      let res = await libraryDetail({region_id, page, pageSize })
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

  .btn__primary {
    color: #fff;
    background-color: #199fff;
  }
}
</style>