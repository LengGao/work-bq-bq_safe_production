<template>
  <view class="library-list">
    <view class="search-bar">
      <uni-search-bar placeholder="自定义背景色" bgColor="#EEEEEE" @confirm="search" />
    </view>

    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
        <CardRow v-for="library in librarys" :key="library.id" :leftImage="library.thumb" :rightFooter="library.time"
                 @clickRight="() => onClickLibrary()">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              <uni-icons type="wallet" size="28rpx" color="#dd524d" />
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

export default {
  components: { CardRow },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      // mescroll: null,
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
  methods: {
    // 点击政策栏
    onClickPolicy() {

    },
    // 
    mescrollInit(e) {
      console.log("mescrollInit", e);

    },
    // 上拉
    async onUp(page) {
      console.log('page', page);
      // this.pageNum = page.num; // 页码, 默认从1开始
      // // const pageSize = page.size; // 页长, 默认每页10条
      // const res = await this.getData()
      // console.log(res)
      // // 接口返回的当前页数据列表 (数组)
      // let curPageData = res.data.data;
      // // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
      // let curPageLen = curPageData.length;
      // // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
      // let totalSize = 30 || res.data.total;
      // //设置列表数据
      // if (page.num == 1) this.courseData = []; //如果是第一页需手动置空列表
      // this.courseData = this.courseData.concat(curPageData); //追加新数据
      // // 请求成功,隐藏加载状态
      // //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      this.mescroll.endBySize(1, 1);
    },
    // 下拉
    async onDown(page) {
      console.log('page2', page);
    },
    // 数据获取
    getData() {
      return new Promise((resove) => {
        uni.request({
          url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
          data: {
            page: this.pageNum,
            limit: 10
          },
          header: {
            token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjUwNTE5MzIxfQ=='
          },
          success: (res) => {
            resove(res.data)
          }
        })
      })
    }

  }, // methods end

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

@import "@/styles/logan.scss";

.policy-list {
  padding: $page-padding;
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
</style>