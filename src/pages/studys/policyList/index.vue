<template>
  <view class="policy-list">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="list">
     <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true">
        <CardRow v-for="policy in policys" :key="policy.id" class="list-item">
          <template v-slot:cardBodyLeft>
            <view class="logan-card-body-left">
              <image class="logan-img-size-lg" :src="policy.cover || defaultCover" @click="previewImg(policy.cover)" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="logan-card-body-right" @click="() => onClickRecommend(policy)">
              <view class="logan-card-right-top">
                <text>{{ policy.title }}</text>
              </view>
              <view class="logan-card-right-center">{{ policy.create_time }}</view>
              <view class="logan-card-right-footer">
                <view class="audience">
                  <uni-icons type="person" size="24rpx" />
                  <text class="audience-text">{{ policy.virtual_num }}人看过</text>
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
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import defaultCover from '@/static/no-data.png'
import {
  articleList
} from  '@/api/index'

export default {
  mixins: [MescrollMixin],
  components: {
    CardRow,
    CustomHeader
  },
  data() {
    return {
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },
      defaultTitle: '政策列表',
      defaultCover: defaultCover,
      policys: [],
    }
  },
  methods: {
    onClickRecommend(item) {
      uni.navigateTo({ url: `/pages/studys/policyDetails/index?policy_id=${item.id}` })
    },
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        region_id: this.region_id,
        category_id: this.category_id,
        price_type: this.type_id
      }
      const res = await articleList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.list;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.policys = [];
      this.policys = this.policys.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
    },

  }, // methods end

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.policy-list {
  height: 100%;
  background-color: $bg-color-list;
}

.list {
  padding: 20rpx;
  
  .list-item {
    margin-top: 20rpx;
    background-color: #fff;
  }

  .logan-card-right-top {
    font-size: $font-size-base;
  }

  .logan-card-right-center {
    font-size: $font-size-sm;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-sm;
  }

  .audience {
    font-size: $font-size-sm;
    color: $color-primary;
    &-text {
      margin-left: 10rpx;
    }
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