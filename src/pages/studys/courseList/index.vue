<template>
  <view class="course-list">
    <view class="course-list-header">
      <DropdownFilter class="picker" :data="categoryData" v-model="categoryValue" @change="(val) => reloadList('category', val)" />
      <DropdownSelect class="picker" :data="typeData" v-model="typeValue" @change="(val) => reloadList('type', val)" />
    </view>
    <view class="mescroll-box">
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback" :up="up" :fixed="true" :topbar="true" :safearea="true">
      <view class="course-list-container">
        <view class="course-item" v-for="item in courseData" :key="item.id">
          <view class="course-item-cover">
            <view class="course-tag course-tag--success" v-if="!item.price">免费课</view>
            <view class="course-tag" v-else>认证课</view>
            <image class="course-img" :src="item.cover" mode="aspectFit" />
          </view>
          <view class="course-item-content">
            <view class="course-name">{{ item.title }}</view>
            <view class="course-time">
              {{ item.chapter_count }}章
              {{ item.learn_count }}课时
            </view>
            <view class="course-other">
              <view class="course-other-count">
                <uni-icons type="person-filled" color="#fff" class="icon-person" size="32rpx"></uni-icons> {{ item.learn_count }} 人在学
              </view>
              <view v-if="item.price === 0" class="course-other-tag"> 免费</view>
              <view v-else class="course-other-price">
                ￥{{ item.price }} 
                <!-- <text class="origin">￥{{ item.origin }}</text> -->
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
import {
  courseList
} from '@/api/course'

export default {
  components: {
    DropdownFilter,
    DropdownSelect
  },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      // mescroll
      up: {
        page: {
          num: 0,
          size: 2,
          time: 500,
          auto: false
        }
      },
      region_id: 1,
      category_id: 0,
      type_id: 0,

      categoryValue: '',
      categoryData: [
        { name: '全部', value: 0, children: [{ name: '全部', value: 0 }] },
        { name: '安监类', value: 1,
          children: [
            { name: '低压电工', value: 11 },
            { name: '融化焊接', value: 12 },
            { name: '安全管理员', value: 13 },
          ]
        },
        { name: '学历类', value: 2,
          children: [
            { name: '成人高考', value: 21 },
            { name: '开放教育', value: 22 },
            { name: '自学考试', value: 23 },
          ]
        }
      ],
      typeValue: '',
      typeData: [
        { name: '全部类型', value: '' },
        { name: '免费课', value: 1 },
        { name: '认证课', value: 2 },
      ],
      courseData: [],
    };
  },
  methods: {
    reloadList(type, val) {
      if (type === 'category') {
        this.category_id = val
      } else {
        this.type_id = val
      }
      this.downCallback()
    },
    // 下拉
    downCallback() {
      this.mescroll.resetUpScroll(true)
    },
    // 上拉
    async upCallback(page) {
      const data = {
        page: page.num,
        page_size: page.size,
        region_id: this.region_id,
        category_id: this.category_id,
        categoryType: this.categoryType,
        typeValue: this.typeValue
      }
      const res = await courseList(data)
      if (res.code !== 0) return this.mescroll.endBySize(0, 0);
      // 接口返回的当前页数据列表 (数组)
      let curPageData = res.data.data
      // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
      let curPageLen = curPageData.length;
      // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
      let totalSize = res.data.total;
      //设置列表数据
      if (page.num == 1) this.courseData = []; //如果是第一页需手动置空列表
      this.courseData = this.courseData.concat(curPageData); //追加新数据
      // 请求成功,隐藏加载状态 方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      this.mescroll.endBySize(curPageLen, totalSize);
    },
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
        }
      }
    }
  }
}
</style>