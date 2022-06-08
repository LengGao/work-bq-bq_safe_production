<template>
  <view class="user-class-list">
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="onDown" @up="onUp">
      <template v-if="classList.length">
      <u-section v-for="item in classList" :key="item.id" :title="item.join" type="line" padding="30rpx" color="#999">
        <CardRow :leftImage="item.thumb" @clickRight="onClickCource" @previewImg="previewImg">
          <template v-slot:rightTop>
            <view class="logan-card-right-top">
              班级类型：<text class="content">{{ item.title }}</text>
            </view>
          </template>
          <template v-slot:rightCenter>
            <view class="logan-card-right-center">
              班级人数：<text class="content">82人</text>
            </view>
          </template>
          <template v-slot:rightFooter>
            <view class="logan-card-right-footer">
              {{ item.join }}加入班级
            </view>
          </template>
        </CardRow>
      </u-section>
      </template>
      <template v-else>
        <noData>您暂时没有任何班级数据</noData>
      </template>
    </mescroll-body>
  </view>
</template>

<script>
import uSection from "@/components/uSection/index"
import CardRow from "@/components/card-row/index";
import noData from "@/components/noData/index"
import { browser } from '@/mixins/index'
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  mixins: [browser, MescrollMixin],
  components: { 
    CardRow, 
    uSection,
    noData,
  },
  data() {
    return {
      classList: [
        { 
          id: 1, name: "name1", money: 0, oldMoney: 0, thumb: '/static/img/index_cource1.png', 
          title: "建筑设计防火规范标准", progress: "30", 
          join: '2022年4月20日'
        },
        { 
          id: 2, name: "name2", money: 998, oldMoney: 1998, thumb: "/static/img/index_cource1.png", 
          title: "特种作业低压电工实操课", time: "12章24课时", progress: "30",
          join: '2022年4月20日' 
        }
      ]
    }
  },
  methods: {
    // 下拉
    onDown() {
      this.mescroll.endBySize(1, 1)
    },
    // 上拉
    onUp() {
      this.mescroll.endBySize(1, 1)
    },
    // 班级详情
    onClickCource() {

    },
    // 图片预览
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.user-class-list {
  padding: 0 30rpx;
  width: calc(750rpx - 60rpx);
  background-color: #f8f8f8;
}

.section {
  margin-top: 40rpx;
}

::v-deep .uni-section-header {
  padding-bottom: 0;
}

::v-deep .uni-section__content {
  font-size: $font-size-sm;
}

.card-row {
  padding: 16rpx 0;
}

.logan-card-right-top {
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  width: 100%;
  font-size: $font-size-sm;
  color: #666666;
}

.logan-card-right-center {
  justify-content: flex-start;
  font-size: $font-size-sm;
  color: #666666;
}

.logan-card-right-footer {
  font-size: $font-size-sm;
  color: #999999;
}

.content {
  margin-left: 10rpx; 
  color: #199fff;
}
</style>