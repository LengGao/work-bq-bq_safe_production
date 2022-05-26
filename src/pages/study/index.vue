<template>
  <view class="study">
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
          <text>全部</text>
          <uni-icons type="forward" size="32rpx" />
        </view>
      </view>

      <view class="courses-list">
      <scroll-view scroll-y @scrolltolower="() => upCallback(page)" style="height: 1000rpx">
          <CardRow v-for="course in courses" :key="course.id" :leftImage="course.thumb" :rightTop="course.title"
                   :rightFooter="course.time" @clickRight="() => onClickCource(course.id)" @previewImg="previewImg">
            <template v-slot:rightFooterIcon>
              <uni-tag type="primary" class="tag" :class="course.type" :text="course.tag" inverted />
            </template>
          </CardRow>
         <view v-if="isFinish" style="width: 100%; font-size: '24rpx'; text-align: center;"> 没有更多了</view>
      </scroll-view>
      </view>
    </view>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";

export default {
  mixins: [MescrollMixin],
  components: {
    CardRow,
  },
  data() {
    return {
      isFinish: false,
      page: { num: 0, size: 1 },

      titleBg: 'https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/study_swiper.png',
      dataIcon: '/static/img/study_iicon_data.png',
      voucherIcon: '/static/img/study_icon_voucher.png',

      // 推荐课程
      courses: [
        { id: 26, thumb: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "已完成", prpress: 800, type: 'tag-one' },
        { id: 27, thumb: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", prpress: 100, type: 'tag-two' },
        { id: 28, thumb: "/static/img/study_cource1.png", title: "建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准 建筑设计防火规范标准", time: "12章24课时", tag: "未开始", prpress: 0, type: 'tag-three' }
      ],
    };
  },
  mounted() {
    this.downCallback()
  },
  methods: {
    toLearn(val) {
      if (val === 1) {
        uni.navigateTo({ url: '/pages/studys/learnData/index' })
      } else {
        uni.navigateTo({ url: '/pages/studys/certificateList/index' })
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
      // if (this.isFinish) return;
      // page.num++;
      // const data = {
      //   page: page.num,
      //   page_size: page.size,
      //   course_id: this.courseId
      // }
      // const res = await courseGetCommentList(data)
      // if (res.code !== 0) return page.num -= 1;

      // let curPageData = res.data.data
      // let totalSize = res.data.total;
      // let curPageLen = curPageData.length + this.comments.length
      // if (page.num == 1) this.comments = [];
      // this.comments = this.comments.concat(curPageData);
      // this.endBySize(curPageLen, totalSize);
    },
    // 技术判断
    endBySize(curPageLen, totalSize) {
      // if (curPageLen >= totalSize) {
      //   this.isFinish = true
      // } else {
      //   this.isFinish = false
      // }
      // return this.isFinish
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
  height: 100%;
  padding: 16rpx 0;
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

  .tag {
    position: relative;
    bottom: 8rpx;
    font-size: 24rpx;
    font-weight: 700;
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