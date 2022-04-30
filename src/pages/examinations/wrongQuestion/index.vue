<template>
  <view class="wrong-question">
    <uni-notice-bar show-icon text="答对一次后自动移除错题 " />
    <mescroll-body class="wrong-question-list" ref="mescrollRef" @init="mescrollInit" @down="downCallback"
                   :down="downOption" :up="upOption" @up="upCallback">
      <view class="wrong-question-list-item" v-for="item in list" :key="item.id">
        <view class="title">{{ item.chapter_name }}（{{ item.topic_num }}）</view>
        <view class="actions">
          <view class="btn-primary plain" @click="toAnswer(1, item.id, item.chapter_name)">背题</view>
          <view class="btn-primary" @click="toAnswer(0, item.id, item.chapter_name)">重练</view>
        </view>
      </view>
    </mescroll-body>
  </view>

</template>
<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { getFavoritesList } from "@/api/question";
export default {
  mixins: [MescrollMixin], // 使用mixin
  name: "wrongQuestion",
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
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      const data = {
        is_collection: 0,
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
        url: `/pages/answer/index?title=${title}&type=8&isAnalysis=${isAnalysis}&chapterId=${chapterId}`,
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.wrong-question {
  .wrong-question-list {
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