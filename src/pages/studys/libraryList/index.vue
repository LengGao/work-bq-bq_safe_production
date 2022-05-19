<template>
  <view class="library-list">
    <view class="search-bar">
      <uni-search-bar @confirm="onSearch" @clear="onClear" v-model="keyword" placeholder="请输入您想要搜索的关键词" bgColor="#fff" cancelButton="none" />
    </view>

    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.thumb" :rightFooter="library.time"
                 @clickRight="() => onClickLibrary()" class="list-item">
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
import { getChapterList } from '@/api/question'

export default {
  components: { CardRow },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      keyword: '',
      courseData: [],
      // 文库资料
      librarys: [
        { id: 1, name: "name1", thumb: "/static/img/index_policy1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 2, name: "name1", thumb: "/static/img/index_policy1.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 3, name: "name1", thumb: "/static/img/index_policy1.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 4, name: "name1", thumb: "/static/img/index_policy1.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
      ],
    }
  },
  mounted() {

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
    onClickLibrary() {
      uni.navigateTo({ url: '/pages/studys/libraryDetails/index' })
    },
    // 初始化 
    mescrollInit(e) {
    },
    // 上拉加载
    async onUp(page) {
      this.mescroll.endBySize(1, 1)
    },
    // 下拉刷新
    async onDown(page) {
      // const res = await getChapterList()
      page.endBySize(1, 1)
    },
    // 数据获取
    getData() {

    }

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