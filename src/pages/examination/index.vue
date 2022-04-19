<template>
  <view class="examination">
    <swiper @change="onChangeSwiper" :interval="2000" autoplay circular disable-touch>
      <swiper-item v-for="swiper in swipers" :key="swiper.id" :current-item-id="swiper.id">
        <image :src="swiper.thumb" class="swiper-image" mode="aspectFit" />
      </swiper-item>
    </swiper>

    <view class="grids">
      <uni-grid :column="4" :showBorder="false" @change="onChangeGrid" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item">
          <view class="grid-box">
            <image :src="grid.thumb" class="grid-image" mode="widthFix" />
            <text class="grid-text">{{ grid.title }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="examinationcard-bar">
      <view class="examinationcard-list">
        <view v-for="examination in examinations" :key="examination.id" class="examinationcard-list-item">
          <ExaminationCard :leftImage="examination.thumb" :rightTop="examination.name"
                           :rightFooter="examination.desc" />
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import ExaminationCard from './components/ExaminationCard'
export default {
  components: {
    ExaminationCard
  },
  data() {
    return {
      // 宫格数据
      gridIndex: 0,
      grids: [
        { id: 1, thumb: "../../static/logo.png", title: "我的课程", url: "" },
        { id: 2, thumb: "../../static/logo.png", title: "我的题库", url: "" },
        { id: 3, thumb: "../../static/logo.png", title: "我的班级", url: "" },
        { id: 4, thumb: "../../static/logo.png", title: "我的问答", url: "" }
      ],
      // 推荐课程
      examinations: [
        { id: 1, name: "章节练习", desc: '这是描述文案', thumb: '/static/logo.png', url: "" },
        { id: 2, name: "模拟考试", desc: '这是描述文案', thumb: '/static/logo.png', url: '' },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: "../../static/logo.png", url: "" },
        { id: 2, thumb: "../../static/logo.png", url: "" },
        { id: 3, thumb: "../../static/logo.png", url: "" },
      ],
    };
  },
  methods: {
    // 滑动选择事件
    onChangeSwiper() { },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.examination {
  width: 100%;
  overflow: hidden;
}

.examinationcard-bar {
  border-top: $logan-border-spacing;
  padding: 16rpx 20rpx;
}

.examinationcard-list-item {
  margin-top: 20rpx;
  border: 2rpx solid $border-color-spacing;
}

.grids {
    margin-top: 40rpx;
}

.grid {
    &-item {
        flex: 1 1 1;
    }

    &-box {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 100%;
    }

    &-image {
        width: 80rpx;
        height: 80rpx;
        border-radius: $border-radius-circle;
    }

    &-text {
        margin-top: 10rpx;
        font-size: $font-size-sm;
    }
}

</style>