<template>
  <view class="library-list">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="search-bar">
      <uni-search-bar v-model="keyword" placeholder="请输入您想要搜索的关键词" bgColor="#fff" cancelButton="none" 
        @confirm="onSearch" @clear="onClear"  @cancel="onCancel" />
    </view>
    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.cover"
                 :rightFooter="library.time || '--'" @clickRight="() => onClickLibrary(library)" class="list-item">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              <uni-icons custom-prefix="iconfont" :type="fileTypeMap[library.file_type] || defaultFileType" size="28rpx" color="#aaa"/>
              <text class="library-text">{{ library.title }}</text>
            </view>
          </template>
        </CardRow>
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { libraryList } from '@/api/index'

export default {
  mixins: [MescrollMixin],
  components: { 
    CardRow,
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '文库列表',
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },
      keyword: '',
      region_id: '',
      librarys: [],
      fileTypeMap: {
        'ppt': 'icon-PPT',
        'txt': 'icon-txt',
        'zip': 'icon-wenjianleixing-biaozhuntu-yasuowenjian',
        'pdf': 'icon-wenjianleixing-biaozhuntu-PDFwendang',
        'doc':  'icon-wenjianleixing-biaozhuntu-Wordwendang',
        'docs':  'icon-wenjianleixing-biaozhuntu-Wordwendang',
        'docx':  'icon-wenjianleixing-biaozhuntu-Wordwendang',
        'xls':  'icon-wenjianleixing-suolvetu-gongzuobiao',
        'xlsx':  'icon-wenjianleixing-suolvetu-gongzuobiao',
        'jpg':  'icon-wenjianleixing-suolvetu-tupianwenjian',
        'gif':  'icon-wenjianleixing-suolvetu-tupianwenjian',
        'png':  'icon-wenjianleixing-suolvetu-tupianwenjian',
        'jpeg':  'icon-wenjianleixing-suolvetu-tupianwenjian',
      },
    }
  },
  onLoad() {
    this.region_id = this.$store.getters.region.id
  },
  methods: {
    // 清空搜索
    onClear() {
      this.keyword = ''
      this.reloadList()
    },
    onCancel() {
      this.reloadList()
    },
    // 搜索
    onSearch({ value }) {
      this.keyword = value
      this.reloadList()
    },
    // 点击政策栏
    onClickLibrary(item) {
      let url = `/pages/studys/libraryDetails/index?library_id=${item.id}`
      uni.navigateTo({ url: url })
    },
    previewImg(url) {
      uni.previewImage({ urls: [url] })
    },
    reloadList(type, val) {
      this.downCallback()
    },
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        keyword: this.keyword,
      }
      const res = await libraryList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.list;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.librarys = [];
      this.librarys = this.librarys.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
    },
  }, // methods end

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.library-list {
  height: 100%;
  background-color: #f8f8f8;
}

.search-bar {
  margin: 10rpx 14rpx;
}

.list {
  padding: 0 30rpx;
  height: 100%;

  &-item {
    margin-top: 20rpx;
    background-color: #fff;
  }

  &-item:nth-child(2) {
    margin-top: 0;
  }

  .logan-card-right-center {
    font-size: $font-size-sm;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-sm;
  }

  .library-text {
    margin-left: 10rpx;
  }
}

::v-deep .uni-searchbar__box {
  justify-content: flex-start;
}
</style>