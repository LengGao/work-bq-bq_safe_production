<template>
  <view class="examination">
    <view class="logan-list-head">
      <view class="logan-list-head-left">
        <text>低压电工作业题库</text>
        <uni-icons type="bottom" size="32rpx" />
      </view>
    </view>

    <view class="head-swiper">
      <swiper @change="onChangeSwiper" :autoplay="false" circular disable-touch class="swiper">
        <swiper-item v-for="swiper in swipers" :key="swiper.id" :current-item-id="swiper.id">
          <image :src="swiper.thumb" class="swiper-image" mode="aspectFit" />
        </swiper-item>
      </swiper>
    </view>

    <view class="grids">
      <uni-grid :column="5" :showBorder="false" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item">
          <navigator class="grid-box" :url="grid.url">
            <image :src="grid.thumb" class="grid-image" mode="aspectFit" />
            <text class="grid-text">{{ grid.title }}</text>
          </navigator>
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
        { id: 1, thumb: "/static/img/examination_gird1.png", title: "收藏夹", url: "" },
        { id: 2, thumb: "/static/img/examination_gird2.png", title: "错题集", url: "" },
        { id: 3, thumb: "/static/img/examination_gird3.png", title: "学习报告", url: "../learnReport/index" },
        { id: 4, thumb: "/static/img/examination_gird4.png", title: "考试记录", url: "" },
        { id: 5, thumb: "/static/img/examination_gird5.png", title: "题目答疑", url: "" }
      ],
      // 推荐课程
      examinations: [
        { id: 1, name: "章节练习", desc: '这是描述文案', thumb: '/static/img/examination_icon_list1.png', url: "" },
        { id: 2, name: "模拟考试", desc: '这是描述文案', thumb: '/static/img/examination_icon_list2.png', url: '' },
        { id: 3, name: "模拟考试", desc: '这是描述文案', thumb: '/static/img/examination_icon_list3.png', url: '' },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: "/static/img/examination-swiper.png", url: "" }
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

.head-swiper {
  padding: 0 20rpx;

  .swiper {
    width: 710rpx;
    height: 280rpx; // 同时控制着轮播图
  }

  .swiper-image {
    width: 100%;
    height: 100%;
  }
}

.examinationcard-bar {
  border-top: $logan-border-spacing-md;
  padding: 16rpx 20rpx;
}

.examinationcard-list-item {
  margin-top: 20rpx;
  border: 2rpx solid $border-color-spacing;
}

.grids {
  padding: 20rpx 0;
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
    margin: auto 0;
  }

  &-image {
    width: 64rpx;
    height: 64rpx;
  }

  &-text {
    margin-top: 20rpx;
    font-size: $font-size-sm;
  }
}
</style>