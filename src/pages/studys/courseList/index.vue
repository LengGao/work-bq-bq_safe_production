<template>
  <view class="course-list">
    <custom-header :title="defaultTitle"></custom-header>
    
    <view class="course-list-header">
      <DropdownFilter class="picker" v-if="categoryData.length" :nodeList="categoryData" v-model="category_id"
                      @change="(val) => reloadList('category', val)" />
      <DropdownSelect class="picker" v-if="typeData.length" :nodeList="typeData" v-model="type_id"
                      @change="(val) => reloadList('type', val)" />
    </view>
    <view class="mescroll-box">
      <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true"
                     :topbar="true" :safearea="true">
        <view class="course-list-container">
          <view class="course-item" v-for="item in courseData" :key="item.id">
            <view class="course-item-cover">
              <view class="course-tag course-tag--success" v-if="item.price_type === 0">免费课</view>
              <view class="course-tag course-tag--primary" v-else-if="item.price_type === 1">认证课</view>
              <view class="course-tag" v-else>认证课</view>
              <image class="course-img" :src="item.cover" @click="() => previewImg(item.cover)" mode="aspectFill" />
            </view>
            <view class="course-item-content" @click="() => toDetails(item.id)">
              <view class="course-name">{{ item.title }}</view>
              <view class="course-time">
                {{ item.chapter_count }}章
                {{ item.lesson_count }}课时
              </view>
              <view class="course-other">
                <view class="course-other-count">
                  <uni-icons type="person-filled" color="#fff" class="icon-person" size="32rpx"></uni-icons>
                  {{ item.learn_count }} 人在学
                </view>
                <view class="cost">
                  <uni-tag class="tag" v-if="item.duration" size="small" :text="item.duration + '分钟'" inverted />
                </view>
              </view>
            </view>
          </view>
        </view>
      </mescroll-body>
    </view>
  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import DropdownFilter from '@/components/dropdown-filter'
import DropdownSelect from '@/components/dropdown-select'
import CustomHeader from "@/components/custom-header";

import {
  courseCategory,
  courseList,
  coursePriceType,
} from '@/api/course'

export default {
  mixins: [MescrollMixin],
  components: {
    DropdownFilter,
    DropdownSelect,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '课程列表',

      up: {
        page: {
          num: 0,
          size: 20,
          time: 500,
        },
      },

      region_id: 0,
      courseData: [],

      // 分类
      category_id: 0, // 0 全部
      categoryData: [],

      // 类型
      type_id: -1, // -1 全部
      typeData: [],
    };
  },
  onLoad() {
    this.region_id = this.$store.getters.region.id
    this.courseCategory()
    this.coursePriceType()
  },
  methods: {
    toDetails(id) {
      let url = `/pages/studys/courseDetail/index`,
        query = `?course_id=${id}`
      uni.navigateTo({ url: url + query })
    },
    previewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },
    reloadList(type, val) {
      if (type === 'category') {
        this.category_id = val
      } else {
        this.type_id = val
      }
      this.downCallback()
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
      const res = await courseList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      let curPageData = res.data.data;
      let curPageLen = curPageData.length;
      let totalSize = res.data.total;
      if (page.num == 1) this.courseData = [];
      this.courseData = this.courseData.concat(curPageData);
      this.mescroll.endBySize(curPageLen, totalSize);
    },
    // 分类
    async courseCategory() {
      let res = await courseCategory()
      if (res.code === 0) {
        let list = res.data
        list.shift()
        list.unshift({id: -1, title: "全部分类", sub: []})
        this.categoryData = list
      }
    },
    async coursePriceType() {
      let res = await coursePriceType()
      if (res.code === 0) {
        this.typeData = res.data
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.mescroll-box {
  height: 100vh;
}
.course-list {
  background-color: #f8f8f8;
  &-header {
    z-index: 990;
    position: sticky;
    top: var(--window-top);
    display: flex;
    align-items: center;
    background-color: #fff;
    .picker {
      flex: 1;
    }
  }
  &-container {
    padding: 35rpx 20rpx 0;
    .course-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 24rpx 16rpx;
      display: flex;
      margin-bottom: 20rpx;
      &-cover {
        position: relative;
        line-height: 0;

        .course-img {
          width: 228rpx;
          height: 130rpx;
        }

        .course-tag {
          line-height: initial;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          padding: 5rpx 24rpx;
          background-color: $uni-color-primary;
          color: #fff;
          font-size: $uni-font-size-sm;
          border-top-left-radius: 12rpx;
          border-bottom-right-radius: 12rpx;
          &--success {
            background-color: $uni-color-success;
          }
          &--primary {
            background-color: #199fff;
          }
        }
        image {
          border-radius: 12rpx;
          width: 228rpx;
          height: 132rpx;
        }
      }
      &-content {
        margin-left: 20rpx;
        flex: 1;
        display: flex;
        line-height: 1;
        flex-direction: column;
        justify-content: space-between;
        .course-name {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
          color: #444444;
          font-size: $uni-font-size-base;
        }
        .course-time {
          font-size: $uni-font-size-sm;
          color: #bbbbbb;
        }
        .course-other {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: $uni-font-size-base;
          .icon-person {
            background-color: #dfecff;
            border-radius: 50%;
            margin-right: 16rpx;
          }
          &-count {
            color: $uni-color-primary;
            font-size: $uni-font-size-sm;
          }
          &-tag {
            color: #f0ad4e;
            border: 2rpx solid #f0ad4e;
            border-radius: 8rpx;
            padding: 4rpx 12rpx;
          }
          &-price {
            color: #f0ad4e;
            font-size: $uni-font-size-md;
            .origin {
              margin-left: 4rpx;
              text-decoration: line-through;
              color: #b1b1b1;
              font-size: $uni-font-size-sm;
            }
          }
          .cost {
            .tag {
              position: relative;
              top: -4rpx;
              color:  #fff;
              background-color: #b23145;
              border-color: #b23145;
            }
          }
        }
      }
    }
  }
}
</style>