<template>
  <view class="user-class-list">
    <custom-header :title="defaultTitle"></custom-header>
    <view class="list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up"
                     :fixed="true">
        <u-section v-for="item in classList" :key="item.id" :title="item.name" type="line" padding="30rpx" color="#999">
          <CardRow :leftImage="item.thumb" @clickRight="() => onClickCource(item)" @previewImg="previewImg">
            <template v-slot:rightTop>
              <view class="logan-card-right-top">
                班级类型：<text class="content">{{ item.user_type }}</text>
              </view>
            </template>
            <template v-slot:rightCenter>
              <view class="logan-card-right-center">
                班级人数：<text class="content">{{ item.user_count }}人</text>
              </view>
            </template>
            <template v-slot:rightFooter>
              <view class="logan-card-right-footer">
                {{ item.join_date }}加入班级
              </view>
            </template>
          </CardRow>
        </u-section>
      </mescroll-body>

    </view>
  </view>
</template>

<script>
import uSection from "@/components/uSection/index"
import CardRow from "@/components/card-row/index"
import noData from "@/components/noData/index"
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { userClasses } from '@/api/user'

export default {
  mixins: [MescrollMixin],
  components: {
    CardRow,
    uSection,
    noData,
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '我的班级',
      classList: [],
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },

    }
  },
  methods: {
    // 班级详情
    onClickCource() {

    },
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size
      }
      const res = await userClasses(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.data;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.classList = [];
      this.classList = this.classList.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
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
  background-color: #f8f8f8;
}

.list {
  padding: 0 30rpx;
  width: calc(750rpx - 60rpx);
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