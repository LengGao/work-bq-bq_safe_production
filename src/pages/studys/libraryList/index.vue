<template>
  <view class="library-list">
    <view class="search-bar">
      <uni-search-bar @confirm="onSearch" @clear="onClear" v-model="keyword" placeholder="请输入您想要搜索的关键词" bgColor="#fff"
                      cancelButton="none" />
    </view>

    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.cover"
                 :rightFooter="library.time || '--'" @clickRight="() => onClickLibrary(library)" class="list-item">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              <uni-icons customPrefix="iconfont" type="icon-file-pdf-fill" size="28rpx" color="#dd524d" />
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
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { browser } from '@/mixins/index'
import {
  libraryList
} from '@/api/index'

export default {
  mixins: [browser,MescrollMixin],
  components: { CardRow },
  data() {
    return {
      keyword: '',
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },
      librarys: [],
    }
  },
  onLoad() {
    this.region_id = this.$store.getters.region.id
  },
  methods: {
    // 清空搜索
    onClear(e) {
      console.log('onClear', e);
      this.keyword = ''
    },
    // 搜索
    onSearch(e) {
      console.log('onSearch', e)
    },
    // 点击政策栏
    onClickLibrary(item) {
      let url = `/pages/studys/libraryDetails/index`,
        query = `?library_id=${item.id}`
      uni.navigateTo({ url: url + query })
    },
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    reloadList(type, val) {
      if (type === 'category') {
        this.category_id = val
      } else {
        this.type_id = val
      }
      this.downCallback()
    },
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        // region_id: this.region_id,
        category_id: this.category_id,
        price_type: this.type_id
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
$page-padding: 16rpx 20rpx 0;

.library-list {
  padding: $page-padding;
  height: 100%;
  background-color: #f8f8f8;
}

.list {
  height: 100%;

  &-item {
    margin-top: 26rpx;
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

  .audience {
    color: $color-primary;
  }

  .present-price {
    font-size: $font-size-lg;
    color: $color-warning;
  }

  .original-price {
    margin-left: 8rpx;
    font-size: $font-size-base;
    text-decoration: line-through #999;
  }

  .tag {
    position: relative;
    bottom: 8rpx;
    font-size: 24rpx;
    font-weight: normal;
  }
}

::v-deep .uni-searchbar__box {
  justify-content: flex-start;
}
</style>