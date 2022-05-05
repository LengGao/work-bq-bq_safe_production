<template>
  <view class="course-list">
    <view class="course-list-header">
      <DropdownFilter class="picker" :data="categoryData" v-model="categoryType" @change="reloadList" />
      <DropdownSelect class="picker" :data="typeData" v-model="typeValue" @change="reloadList" />
    </view>
    <mescroll-body ref="mescrollRef" @init="mescrollInit" @down="downCallback" @up="upCallback">
      <view class="course-list-container">
        <view class="course-item" v-for="(item ,index ) in courseData" :key="index">
          <view class="course-item-cover">
            <view class="course-tag course-tag--success" v-if="item.free">免费课</view>
            <view class="course-tag" v-else>认证课</view>
            <image src="https://img0.baidu.com/it/u=2909438345,4163729783&fm=253&fmt=auto&app=138&f=JPEG?w=658&h=437">
            </image>
          </view>
          <view class="course-item-content">
            <view class="course-name">2022逆袭提分强化班—初级会计师</view>
            <view class="course-time">12章24课时 | 共30学时</view>
            <view class="course-other">
              <view class="course-other-count">
                <uni-icons type="person-filled" color="#fff" class="icon-person" size="32rpx"></uni-icons>
                678人已学
              </view>
              <view v-if="item.free" class="course-other-tag">
                免费
              </view>
              <view v-else class="course-other-price">
                $199 <text>$259</text>
              </view>
            </view>
          </view>
        </view>
      </view>
    </mescroll-body>

  </view>
</template>

<script>
import MescrollMixin from "@/uni_modules/mescroll-uni/components/mescroll-uni/mescroll-mixins.js";
import DropdownFilter from '@/components/dropdown-filter'
import DropdownSelect from '@/components/dropdown-select'
export default {
  components: {
    DropdownFilter,
    DropdownSelect
  },
  mixins: [MescrollMixin], // 使用mixin
  data() {
    return {
      categoryName: '全部分类',
      categoryId: 0,
      categoryType: '',
      categoryData: [
        {
          name: '全部',
          value: 0,
          children: [
            {
              name: '全部',
              value: 0,
            }
          ]
        },
        {
          name: '安监类',
          value: 1,
          children: [
            {
              name: '测试1',
              value: 2
            },
            {
              name: '测试2',
              value: 3
            },
            {
              name: '测试3',
              value: 4
            },
            {
              name: '测试4',
              value: 5
            },
            {
              name: '测试5',
              value: 6
            },
          ]
        },
        {
          name: '学历类',
          value: 3,
          children: [
            {
              name: '测试1',
              value: 2
            },
            {
              name: '测试2',
              value: 3
            },
            {
              name: '测试3',
              value: 4
            },
            {
              name: '测试4',
              value: 5
            },
            {
              name: '测试5',
              value: 6
            },
          ]
        }
      ],
      typeValue: 0,
      typeData: [
        { name: '全部类型', value: '' },
        { name: '免费课', value: 1 },
        { name: '认证课', value: 2 },
      ],
      courseData: [],
    };
  },
  created() {
  },
  methods: {
    reloadList() {
      this.mescroll.resetUpScroll();
    },
    async upCallback(page) {
      // const pageSize = page.size; // 页长, 默认每页10条
      const data = {
        page: page.num,
        limit: page.size,
        categoryType: this.categoryType,
        typeValue: this.typeValue
      }
      const res = await this.getCousrList(data)
      // 接口返回的当前页数据列表 (数组)
      let curPageData = res.data.data || [];
      // 接口返回的当前页数据长度 (如列表有26个数据,当前页返回8个,则curPageLen=8)
      let curPageLen = curPageData.length;
      // 接口返回的总页数 (如列表有26个数据,每页10条,共3页; 则totalPage=3)
      let totalSize = 30 || res.data.total;
      //设置列表数据
      if (page.num == 1) this.courseData = []; //如果是第一页需手动置空列表
      this.courseData = this.courseData.concat(curPageData); //追加新数据
      // 请求成功,隐藏加载状态
      //方法二(推荐): 后台接口有返回列表的总数据量 totalSize
      this.mescroll.endBySize(curPageLen, totalSize);
    },
    getCousrList(data) {
      return new Promise((resove) => {
        uni.request({
          url: 'http://testadmin.beiqujy.com/apidata/admin/v2/StaffNotice/index',
          data,
          header: {
            token: 'eyJzdGFmZl9pZCI6MTY1LCJoZWFkX3Bob3RvIjoiIiwic3RhZmZfbmFtZSI6Ilx1NzllNlx1OWU0Zlx1N2EwYiIsImlzX3N1cGVyIjoxLCJkZXBhcnRtZW50X2lkIjoyMCwiaXNfZGlyZWN0b3IiOjAsInRpbWVfb3V0IjoxNjUwODY4OTY2fQ=='
          },
          success: (res) => {
            resove(res.data)
          }
        })
      })

    },
  },
};
</script>

<style lang="scss" scoped>
.course-list {
  background-color: #fafafa;
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
    padding: 0 20rpx;
    .course-item {
      background-color: #fff;
      border-radius: 12rpx;
      padding: 24rpx 16rpx;
      display: flex;
      margin-bottom: 20rpx;
      &-cover {
        position: relative;
        line-height: 0;
        .course-tag {
          line-height: initial;
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          padding: 5rpx 20rpx;
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
          width: 233rpx;
          height: 130rpx;
        }
      }
      &-content {
        margin-left: 15rpx;
        flex: 1;
        display: flex;
        line-height: 1;
        flex-direction: column;
        justify-content: space-between;
        .course-name {
          font-size: $uni-font-size-base;
          color: #444444;
        }
        .course-time {
          font-size: $uni-font-size-sm;
          color: #bbbbbb;
        }
        .course-other {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 26rpx;
          .icon-person {
            background-color: #dfecff;
            border-radius: 50%;
            margin-right: 8rpx;
          }
          &-count {
            color: $uni-color-primary;
          }
          &-tag {
            color: #fe7e01;
            border: 2rpx solid #fe7e01;
            border-radius: 8rpx;
            padding: 4rpx 12rpx;
          }
          &-price {
            color: #fe7e01;
            text {
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