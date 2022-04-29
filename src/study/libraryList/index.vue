<template>
  <view class="library-list">
    <view class="search-bar">
      <uni-search-bar @confirm="onSearch" v-model="keyword" placeholder="请输入您想要搜索的关键词" >
      </uni-search-bar>
    </view>

    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.thumb" :rightFooter="library.time"
                 @clickRight="() => onClickLibrary()">
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
      // mescroll: null,
      keyword: '',
      courseData: [],
      // 政策列表数据
      policys: [
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_cource1.png', title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource2.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ],
      // 文库资料
      librarys: [
        { id: 1, name: "name1", thumb: "/static/img/index_library1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "2022-03-18 18:30" },
        { id: 2, name: "name1", thumb: "/static/img/index_library2.png", title: "建筑设计防火规范标准", time: "2022-03-18 18:30" },
      ],
    }
  },
  mounted() {

  },
  methods: {
    // 清空搜索
    onClear(e) {
      console.log('onClear', e);
    },
    // 搜索
    onSearch(e) {
      console.log('onSearch', e)
    },
    // 点击政策栏
    onClickPolicy() {
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

.policy-list {
  padding: $page-padding;
  height: 100%;
}

.list {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;

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