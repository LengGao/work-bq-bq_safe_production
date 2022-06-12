<template>
  <view class="study">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="header">
      <view class="header-one">
        <image class="header-one-img" :src="titleBg" mode="scaleToFill" />
      </view>

      <view class="header-two">
        <view class="header-two-box header-two-gb1" @click="toLearn(1)">
          <view class="box-left">
            <text class="box-left-title">学习数据</text>
            <text class="box-left-text">精准数据把控进度</text>
          </view>
          <view class="box-right">
            <image :src="dataIcon" mode="scaleToFill" class="box-right-img" />
          </view>
        </view>

        <view class="header-two-box header-two-gb2" @click="toLearn(2)">
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
        <view class="logan-list-head-left"> 学习课程 </view>
        <view class="logan-list-head-right" @click="onClickAll">
          <text>查看全部课程</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="courses-list">
      <template v-if="courseData.length">
      <scroll-view scroll-y @scrolltolower="() => upCallback(page)" style="height: 1000rpx">
        <CardRow v-for="course in courseData" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="card-body-left">
              <image @click="() => previewImg(course.cover)" :src="course.cover" class="img-size-lg" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="card-body-right" @click="() => onClickCource(course.id)">
              <view class="card-right-top">
                <text>{{ course.title }}</text>
              </view>

              <view class="card-right-center">
                <view class="time">
                  {{ course.chapter_count }}章
                  {{ course.lesson_count }}课时
                  <text style="margin: 0 8rpx;"> | </text>
                  共{{ course.duration_count }}课时
                </view>
              </view>

              <view class="card-right-footer">
                <view class="cost">
                  <view class="tag tag-two" v-if="course.learning_progress >= 100">已学完</view>
                  <view class="tag tag-three" v-else-if="course.learning_progress <= 0" >未开始</view>
                  <view class="tag tag-one" v-else >已学习 {{ course.learning_progress }}%</view>
                </view>
              </view>
            </view>
          </template>
        </CardRow>
         <view v-if="isFinish" style="width: 100%; font-size: '24rpx'; text-align: center;"> </view>
      </scroll-view>
      </template>
      <template v-else>
        <NoData position="relative"  style="margin-top: 25%;" >您暂时没有学习任何课程</NoData>
      </template>
      </view>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import NoData from "@/components/noData/index"
import CustomHeader from "@/components/custom-header"
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { browser, userStatus } from '@/mixins/index'
import { userCourseList } from '@/api/user'

export default {
  mixins: [MescrollMixin, browser, userStatus],
  components: {
    CardRow,
    NoData,
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '安培课堂',
      isFinish: false,
      page: { num: 0, size: 1 },

      titleBg: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/study_swiper.png',
      dataIcon: '/static/img/study_iicon_data.png',
      voucherIcon: '/static/img/study_icon_voucher.png',
      // 推荐课程
      courseData: [],

      needLogin: false
    };
  },
  mounted() {
    this.downCallback()
  },
  methods: {
    toLearn(val) {
      if (this.authority()) {
        if (val === 1) {
          uni.navigateTo({ url: '/pages/studys/learnData/index' })
        } else {
          uni.navigateTo({ url: '/pages/studys/certificateList/index' })
        }
      }
    },
    onClickAll() {
      let path = '/pages/studys/courseList/index'
      uni.navigateTo({ url: path })
    },
    onClickCource(id) {
      let url = '/pages/studys/courseDetail/index'
      let query = `?course_id=${id}`
      uni.navigateTo({ url: url + query })
    },
    // 下拉
    downCallback() {
      this.page.num = 0
      this.upCallback(this.page)
    },
    // 上拉
    async upCallback(page) {
      console.log('upCallback', page);
      if (this.isFinish) return;
      page.num++;
      const data = {
        page: page.num,
        page_size: 3,
      }
      const res = await userCourseList(data)
      if (res.code === 1000 || res.code === 1008) {
        page.num -= 1;
        this.needLogin = true
        return;
      } else if (res.code !== 0) {
        page.num -= 1;
        this.needLogin = true
        return;
      }

      let curPageData = res.data.data
      let totalSize = res.data.total;
      let curPageLen = curPageData.length + this.courseData.length
      if (page.num == 1) this.courseData = [];
      this.courseData = this.courseData.concat(curPageData);
      this.endBySize(curPageLen, totalSize);
    },
    // 技术判断
    endBySize(curPageLen, totalSize) {
      if (curPageLen >= totalSize) {
        this.isFinish = true
      } else {
        this.isFinish = false
      }
      return this.isFinish
    },
    // 图片预览
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    }
  }, // methods end
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding: 16rpx 30rpx;

.study {
  width: 100%;
  height: 100%;
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
    border-radius: 20rpx;
  }
}

.header-two {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 30rpx;
  width: 100%;
  height: 160rpx;

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

.courses-list {
  width: 100%;
  padding: 24rpx 0;

  .card-body-left {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1 1 1;
    height: 100%;
    width: $img-size-width-md;
  }

  .img-size-lg {
    height: 135rpx;
    width: 230rpx;
    border-radius: 12rpx;
  }

  .card-body-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 3 1 0;
    height: 135rpx;
    overflow: hidden;
    margin-left: 20rpx;
    font-size: $font-size-base;
    letter-spacing: 1rpx;
  }

  .card-right-top {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    width: 100%;
    color: $text-color;
  }

  .card-right-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;;
    align-items: flex-start;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;
  }

  .card-right-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
    align-items: baseline;
    width: 100%;
    font-size: $font-size-sm;
    color: $text-color-grey;
  }

  .audience {
    color: $color-primary;
    font-size: $font-size-sm;
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