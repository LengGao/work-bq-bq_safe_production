<template>
  <view class="study">
    <view class="header">
      <view class="header-one">
        <image class="header-one-img" :src="defaultImage" mode="scaleToFill" />
      </view>

      <view class="header-two">
        <view class="header-two-box" @click="to('../learnData/index')">
          <image class="header-two-img" :src="defaultImage" mode="scaleToFill" />
        </view>
        <view class="header-two-box" @click="to('../learnCertificate/index')">
          <image class="header-two-img" :src="defaultImage" mode="scaleToFill" />
        </view>
      </view>
    </view>

    <view class="course-bar">
      <view class="logan-list-head">
        <view class="logan-list-head-left"> 推荐课程 </view>
        <view class="logan-list-head-right">
          <text>全部</text>
          <uni-icons type="forward" size="16" />
        </view>
      </view>

      <view class="courses-list">
        <CardRow v-for="course in courses" :key="course.id" :leftImage="course.thumb" :rightTop="course.title"
                 :rightFooter="course.time">
          <template v-slot:rightFooterIcon>
            <uni-tag custom-style="position: relative; bottom: 4rpx; font-size: 12rpx;" type="primary"
                     :text="course.tag" inverted />
          </template>
        </CardRow>
      </view>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import defaultImage from "@/static/logo.png";

export default {
  components: {
    CardRow,
  },
  data() {
    return {
      defaultImage: defaultImage,
      // 推荐课程
      courses: [
        {
          id: 1,
          name: "name1",
          money: 0,
          oldMoney: 0,
          thumb: "../../static/logo.png",
          title:
            "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准",
          time: "12章24课时",
          num: 897,
          tag: "免费",
        },
        {
          id: 2,
          name: "name2",
          money: 998,
          oldMoney: 1998,
          thumb: "../../static/logo.png",
          title: "特种作业低压电工实操课",
          time: "12章24课时",
          num: 987,
          tag: "未开始",
        },
      ],
    };
  },
  onReachBottom() {
    console.log("到底了");
  },
  methods: {
    to(url) {
      uni.navigateTo({
        url,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding: 16rpx 20rpx;

.study {
  width: 100%;
  overflow: hidden;
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
  }

  &-img {
    width: 100%;
    height: 100%;
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
}
</style>