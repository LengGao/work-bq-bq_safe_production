<template>
  <view class="policy-list">
    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp" :height="1000">
        <CardRow v-for="policy in policys" :key="policy.id" class="list-item">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image class="logan-img-size-lg" :src="policy.thumb" mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right" @click="() => onClickRecommend()">
              <view class="logan-card-right-top">
                <text>{{ policy.title }}</text>
              </view>
              <view class="logan-card-right-center">{{ policy.time }}</view>
              <view class="logan-card-right-footer">
                <view class="audience">
                  <uni-icons type="person" size="24rpx" />
                  <text style="margin-left: 10rpx">{{ policy.num }}人看过</text>
                </view>
                <view class="cost">
                  <view v-if="policy.money > 0">
                    <text class="present-price">￥{{ policy.money }}</text>
                    <text class="original-price">{{ policy.oldMoney }}</text>
                  </view>
                  <uni-tag v-else class="tag" type="warning" size="small" text="免费" inverted />
                </view>
              </view>
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
        { id: 1, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_policy1.png', title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_policy1.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
        { id: 3, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_policy1.png', title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", num: 897, tag: "免费" },
        { id: 4, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_policy1.png", title: "特种作业低压电工实操课", time: "12章24课时", num: 987, tag: "" },
      ],
    }
  },
  methods: {
    // 点击政策列表
    onClickRecommend() {
      uni.navigateTo({ url: '/pages/studys/policyDetails/index' })
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

  }, // methods end

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.policy-list {
  padding: 20rpx;
  height: 100%;
  background-color: $bg-color-list;
}

.list {
  border-top: $logan-border-spacing-md;
  
  .list-item {
    margin-top: 20rpx;
    background-color: #fff;
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
</style>