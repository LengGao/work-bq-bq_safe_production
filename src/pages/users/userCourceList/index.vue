<template>
  <view class="user-cource-list">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                    :safearea="true">
        <CardRow v-for="course in courseData" :key="course.id">
          <template v-slot:cardBodyLeft>
            <view class="card-body-left">
              <image @click="() => previewImg(course.cover)" :src="course.cover" class="img-size-lg" mode="aspectFit" />
            </view>
          </template>
          <template v-slot:cardBodyRight>
            <view class="card-body-right" @click="() => onClickRecommend(course.id)">
              <view class="card-right-top">
                <text>{{ course.title }}</text>
              </view>

              <view class="card-right-footer">
                <view class="time">
                  {{ course.chapter_count }}章
                  {{ course.lesson_count }}课时
                  <text style="margin: 0 8rpx;"> | </text>
                  共{{ course.duration_count }}课时
                </view>
                <view class="cost">
                  <view class="tag two" v-if="course.prpress >= 100">已学完</view>
                  <view class="tag tag-three" v-else-if="course.prpress <= 0" >未开始</view>
                  <view class="tag tag-one" v-else >已学习 {{ course.prpress }}%</view>
                </view>
              </view>
            </view>
          </template>
        </CardRow>
    </mescroll-body>
  </view>
</template>

<script>
import CardRow from "@/components/card-row/index";
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import { userCourseList } from '@/api/user'

export default {
  components: { CardRow },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },
      courseData: [],
    }
  },
  methods: {
    // 点击推荐课程
    onClickRecommend(id) {
      uni.navigateTo({ url: `/pages/studys/courseDetail/index?course_id=${id}` })
    },
    // 预览
    previewImg(url) {
      uni.previewImage({ urls: [url] })
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
      const res = await userCourseList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.data;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.courseData = []; 
      this.courseData = this.courseData.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";


.user-cource-list {
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