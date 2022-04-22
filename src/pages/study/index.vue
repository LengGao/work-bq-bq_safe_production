<template>
  <view class="study">
    <view class="header">
      <view class="header-one">
        <image class="header-one-img" :src="titleBg" mode="scaleToFill" />
      </view>

      <view class="header-two">
        <view class="header-two-box header-two-gb1" @click="to('../learnData/index')">
          <view class="box-left">
            <text class="box-left-title">学习数据</text>
            <text class="box-left-text">精准数据把控进度</text>
          </view>
          <view class="box-right">
            <image :src="dataIcon" mode="scaleToFill" class="box-right-img" />
          </view>
        </view>

        <view class="header-two-box header-two-gb2" @click="to('../learnCertificate/index')">
          <view class="box-left">
            <text class="box-left-title">学习凭证</text>
            <text class="box-left-text">专业/高效拿证</text>
          </view>
          <view class="box-right">
            <image :src="voucherIcon" mode="scaleToFill" class="box-right-img" />
          </view>
        </view>
      </view>
    </view>

    <view class="course-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left"> 推荐课程 </view>
        <view class="logan-list-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="courses-list">
        <CardRow v-for="course in courses" :key="course.id" :leftImage="course.thumb" :rightTop="course.title"
                 :rightFooter="course.time" @clickRight="onClickCource">
          <template v-slot:rightFooterIcon>
            <uni-tag type="primary" class="tag" :class="course.type" :text="course.tag" inverted />
          </template>
        </CardRow>
      </view>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import titleBg from '@/static/img/study_swiper.png';
import dataIcon from "@/static/img/study_iicon_data.png";
import voucherIcon from "@/static/img/study_icon_voucher.png";

export default {
  components: {
    CardRow,
  },
  data() {
    return {
      titleBg,
      dataIcon,
      voucherIcon,

      // 推荐课程
      courses: [
        { id: 1, thumb: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "已完成", prpress: 800, type: 'tag-one' },
        { id: 2, thumb: "/static/img/study_cource2.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", prpress: 100, type: 'tag-two' },
        { id: 3, thumb: "/static/img/study_cource3.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", prpress: 0, type: 'tag-three' }
      ],
    };
  },
  onReachBottom() {
    console.log("到底了");
  },
  methods: {
    to(url) {
      uni.navigateTo({ url })
    },
    // 点击课程
    onClickCource() {
      console.log("onClickCource");
    }

  }, // methods end
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding: 16rpx 20rpx;

.study {
  height: 100%;
  overflow-y: auto;
}

.header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: $padding;
}

.header-one {
  width: 100%;
  height: 300rpx;

  &-img {
    width: 100%;
    height: 100%;
  }
}

.header-two {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  width: 100%;
  height: 200rpx;

  &-box {
    width: 48%;
    height: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
  }

  &-gb1 {
    background-image: url("/static/img/study_bg_data.png");
    background-size: 100% 100%;
  }

  &-gb2 {
    background-image: url("/static/img/study_bg_voucher.png");
    background-size: 100% 100%;
  }

  .box-left {
    display: flex;
    flex-direction: column;
    color: $text-color-inverse;

    &-title {
      font-size: $font-size-lg;
    }

    &-text {
      font-size: $font-size-sm;
    }
  }

  .box-right {
    &-img {
      height: 52rpx;
      width: 52rpx;
    }
  }
}

.course-bar {
  padding: 24rpx 0;
  border-top: $logan-border-spacing-md;

  .logan-card-right-center {
    margin-top: 8rpx;
  }

  .logan-card-right-footer {
    align-items: baseline;
    font-size: $font-size-base;
  }

  .tag {
    position: relative;
    bottom: 8rpx;
    font-size: 24rpx;
    font-weight: normal;
  }

  .tag-one {
    color: $color-primary;
    border-color: $color-primary;
  }

  .tag-two {
    color: $color-success;
    border-color: $color-success;
  }

  .tag-three {
    color: $text-color-grey;
    border-color: $text-color-grey;
  }
}
</style>