<template>
  <mescroll-body class="favorites" ref="mescrollRef" @init="mescrollInit" @down="downCallback" :down="downOption"
                 :up="upOption" @up="upCallback">
    <view class="favorites-list-item" v-for="item in list" :key="item.id">
      <view class="title">{{ item.chapter_name }}（{{ item.topic_num }}）</view>
      <view class="actions">
        <view class="btn-primary plain" @click="toAnswer(1, item.id, item.chapter_name)">背题</view>
        <view class="btn-primary" @click="toAnswer(0, item.id, item.chapter_name)">重练</view>
      </view>
    </view>
  </mescroll-body>
</template>
<script>
import { getFavoritesList } from "@/api/question";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
export default {
  mixins: [MescrollMixin], // 使用mixin
  name: "favorites",
  data() {
    return {
      list: [],
    };
  },
  onShow() {
    this.reloadList()
  },
  methods: {
    /*若希望重新加载列表,只需调用此方法即可(内部会自动page.num=1,再主动触发up.callback)*/
    reloadList() {
      this.mescroll && this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      const data = {
        is_collection: 1,
        page: page.num,
        limit: page.size
      };
      const res = await getFavoritesList(data)
      const curPageData = res.data.list || [];
      const curPageLen = curPageData.length;
      const total = res.data.total
      if (page.num == 1) this.list = []; //如果是第一页需手动置空列表
      this.list = this.list.concat(curPageData); //追加新数据
      this.mescroll.endBySize(curPageLen, total);
    },
    toAnswer(isAnalysis, chapterId, title) {
      uni.navigateTo({
        url: `/pages/answer/index?title=${title}&type=7&isAnalysis=${isAnalysis}&chapterId=${chapterId}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.favorites {
  height: 100%;
  .favorites-list {
    height: 100%;
    &-item {
      padding: 0 30rpx;
      height: 100rpx;
      box-sizing: border-box;
      border-bottom: 1rpx solid #eee;
      color: #666;
      font-size: 28rpx;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .actions {
        display: flex;
        align-items: center;
        justify-content: center;
        .btn-primary {
          color: #fff;
          background-color: $uni-color-primary;
          padding: 2rpx 0 4rpx;
          width: 90rpx;
          text-align: center;
          border-radius: 50rpx;
          font-size: 24rpx;
          &:not(:first-child) {
            margin-left: 20rpx;
          }
          &:active {
            opacity: 0.8;
          }
          &.plain {
            background-color: #fff;
            border: 1px solid $uni-color-primary;
            padding-bottom: 1rpx;
            color: $uni-color-primary;
          }
        }
      }
    }
  }
}
</style>