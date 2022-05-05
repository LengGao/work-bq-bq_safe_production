<template>
  <view class="examination">
    <view class="logan-list-head">
      <view class="logan-list-head-left" @click="onCandidates">
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
      <uni-grid :column="4" :showBorder="false" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item">
          <view class="grid-box" @click="() => to(grid.url)">
            <image :src="grid.thumb" class="grid-image"  mode="aspectFit" />
            <text class="grid-text">{{ grid.title }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="examinationcard-bar">
      <view class="examinationcard-list">
        <view v-for="(examination) in examinations" :key="examination.id" class="examinationcard-list-item">
          <ExaminationCard @click="() => to(examination.url)" :leftImage="examination.thumb" :rightTop="examination.name"
                           :rightFooter="examination.desc" :bgColor="examination.bgColor" >
              <template v-slot:arrow>
                <image :src="examination.arrow" mode="aspectFit" class="arrow-image" />
              </template>
          </ExaminationCard>
        </view>
      </view>
    </view>

    <uni-popup ref="popupRef" type="bottom">
      <view class="popup-box">
      <uni-list>
        <uni-list-item v-for="item in candidates" :key="item.value" @click="onClickItem" clickable>
          <template v-slot:body>
            <view class="list-item-body-test">{{ item.name }}</view>
          </template>
        </uni-list-item>
      </uni-list>
      </view>
    </uni-popup>
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
      // 组合框
      currentCandidates: '',
      candidates: [
        { name: '低压电工作业题库', value: 1 },
        { name: '低压电工作业题库', value: 2 },
        { name: '低压电工作业题库', value: 3 }, 
      ],
      // 宫格数据
      gridIndex: 0,
      grids: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird1.png", title: "收藏夹", url: "/pages/examinations/favorites/index" },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird2.png", title: "错题集", url: "/pages/examinations/wrongQuestion/index" },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird3.png", title: "学习报告", url: "/pages/studys/learnReport/index" },
        { id: 4, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird4.png", title: "考试记录", url: "/pages/examinations/examinationRecord/index" },
        // { id: 5, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird5.png", title: "题目答疑", url: "" }
      ],
      // 推荐课程
      examinations: [
        { id: 1, name: "章节练习", desc: '这是描述文案', bgColor: '#FFFAF4', arrow: '/static/img/examination_bg_list1.png', thumb: '/static/img/examination_icon_list2.png', url: "/pages/examinations/chapterList/index" },
        { id: 2, name: "模拟考试", desc: '这是描述文案', bgColor: '#FFF7F7', arrow: '/static/img/examination_bg_list2.png', thumb: '/static/img/examination_icon_list1.png', url: '/pages/examinations/testPaperIntroduce/index?type=1' },
        // { id: 3, name: "自主出题", desc: '这是描述文案', thumb: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/examination_icon_list2.png', url: '/pages/examinations/independentPaper/index' },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination-swiper.png", url: "" }
      ],
    };
  },

  methods: {
    to(url) {
      uni.navigateTo({url})
    },
    // 滑动选择事件
    onChangeSwiper() {

    },
    onCandidates(e) {
      this.$refs.popupRef.open()
      console.log('onCandidates', e);
    },
    // 
    onClickItem(e) {
      console.log('e',e);
      this.$refs.popupRef.close()
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding-tb: 16rpx;
$padding-lr: 30rpx;

.examination {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: $padding-tb 0;
}

.head-swiper {
  padding: 0 30rpx;

  .swiper {
    width: 100%;
    height: 280rpx; // 同时控制着轮播图
  }

  .swiper-image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
}

.examinationcard-bar {
  border-top: $logan-border-spacing-md;
  padding: 16rpx 30rpx;
}

.examinationcard-list-item {
  margin-top: 20rpx;
  border: 2rpx solid $border-color-spacing;
}

.bg-1 {
  background-color: #FFFAF4;
}

.bg-2 {
  background-color: #FFF7F7;
}

.arrow-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 72rpx;
  height: 72rpx;
}

.grids {
  padding: 20rpx 0;
}

.grid {
  &-item {
    flex: 1;
  }

  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  &-image {
    width: 70rpx;
    height: 70rpx;
    border-radius: 10rpx;
  }

  &-text {
    margin-top: 20rpx;
    font-size: $font-size-base;
  }
}

.popup-box {
  margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom));
  margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
}

.list-item-body-test {
  width: 100%;
  text-align: center;
}

</style>