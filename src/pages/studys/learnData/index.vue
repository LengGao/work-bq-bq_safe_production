<template>
  <view class="learn-data">
    <view class="learn-data-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="16px"></uni-icons>
        <text class="nav-bar-title">学习数据</text>
      </view>
    </view>
    
    <view class="learn-data-container">
      <picker @change="bindPickerChange" :value="activeCourseIndex" :range="array" range-key="title">
        <view class="learn-data-select">
          <uni-icons type="bars" color="#fff" size="40rpx"></uni-icons>
          <text class="course-name">{{ activeCourseTitle }}</text>
        </view>
      </picker>
      <view class="learn-data-card">
        <view class="learn-data-card-header">
          <view class="learn-data-card-header-title">
            <view>本周数据</view>
            <uni-icons type="paperplane-filled" color="#fff" size="40rpx"></uni-icons>
          </view>
          <view class="learn-data-card-header-tabs">
            <view class="tab-item">
              <view class="tab-item-value"><text>{{ learnData.week_minute_total || 0 }}</text> 分钟</view>
              <view class="tab-item-title">本周累计</view>
            </view>
            <view class="tab-item">
              <view class="tab-item-value"><text>{{ learnData.today_minute_total || 0 }}</text> 分钟</view>
              <view class="tab-item-title">今日已学</view>
            </view>
            <view class="tab-item">
              <view class="tab-item-value"><text>{{ learnData.beat_percent || 0 }}</text> %</view>
              <view class="tab-item-title">打败同学</view>
            </view>
          </view>
        </view>
        <view class="learn-data-card-content">
          <view class="charts-box">
            <qiun-data-charts type="column" :tap-legend="false" :chartData="chartData" :opts="chartsOpts" />
          </view>
        </view>
      </view>
      <view class="learn-data-card">
        <view class="learn-data-card-header">
          <view class="learn-data-card-header-title">
            <view>累计数据</view>
            <uni-icons type="paperplane-filled" color="#fff" size="40rpx"></uni-icons>
          </view>
        </view>
        <view class="learn-data-card-content block">
          <view class="block-item primary">
            <view class="block-item-value">
              <text>{{ learnData.learn_minute_total || 0 }}</text>
              分钟
            </view>
            <view class="block-item-title">累计学习时长</view>
          </view>
          <view class="block-item warning">
            <view class="block-item-value">
              <text>{{ learnData.learn_day_total || 0 }}</text>
              天
            </view>
            <view class="block-item-title">累计学习天数</view>
          </view>
          <view class="block-item success">
            <view class="block-item-value">
              <text>{{ learnData.completed_lesson_count || 0 }}</text>
              个
            </view>
            <view class="block-item-title">完成学时总数</view>
          </view>
          <view class="block-item danger">
            <view class="block-item-value">
              <text>{{ learnData.process || 0}}</text>
              %
            </view>
            <view class="block-item-title">课程总进度</view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import qiunDataCharts from "@/uni_modules/ucharts/components/qiun-data-charts/qiun-data-charts.vue";
import { browser } from '@/mixins/index'
import { userCourseList } from '@/api/user'
import { getLearnData } from '@/api/course'

export default {
  mixins: [browser],
  components: {
    qiunDataCharts,
  },
  data() {
    return {
      array: [],
      activeCourseIndex: 0,
      course_id: '',
      learnData: {},
      chartsOpts: {
        legend: {
          show: false,
        },
        extra: {
          column: {
            width: 20,
          },
        },
      },
      chartData: {
        categories: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        series: [
          {
            name: "分数",
            data: [],
          },
        ],
      },
    };
  },
  onLoad() {
    this.userCourseList()
  },
  computed: {
    activeCourseTitle() {
      return this.array[this.activeCourseIndex] ? this.array[this.activeCourseIndex].title : '请选择课程'
    }
  },
  methods: {
    goBack() {
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        history.back()
      }
    },
    bindPickerChange({ detail }) {
      this.activeCourseIndex = detail.value;
      this.course_id = this.array[detail.value].id
       this.getLearnData(this.course_id)
    },
    async userCourseList() {
      let res = await userCourseList()
      if (res .code === 0) {
        this.array = res.data.data.filter(item => item.status !== 0).map(item => ({id: item.id, title: item.title }))
        this.course_id = this.array[0].id
        this.getLearnData(this.course_id)
      }
    },

    async getLearnData(course_id) {
      let params = { course_id }
      let res = await getLearnData(params)
      if (res.code === 0) {
        this.learnData = res.data
        this.chartData.series[0].data = res.data.daily.map(item => +item)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.learn-data {
  height: 100%;
  padding-bottom: 40rpx;
  background: url("http://dpsystem.oss-cn-shenzhen.aliyuncs.com/moren1607659060/340e61e5421cc2d3a8e211d564159037")
    no-repeat;
  background-size: 100% 686rpx;
  font-size: $uni-font-size-base;
  .status_bar {
    height: var(--status-bar-height);
    width: 100%;
  }
  &-header {
    .nav-bar {
      display: flex;
      height: 44px;
      line-height: 44px;
      font-size: 16px;
      color: #fff;
      
      &-back {
        padding: 0 20rpx;
      }
      &-title {
        padding-right: 60rpx;
        margin: 0 auto;
      }
    }
  }
  &-container {
    height: calc(100vh - 44px - var(--status-bar-height));
    overflow-y: auto;
  }
  &-select {
    padding: 20rpx;
    display: flex;
    align-items: center;
    &:active {
      opacity: 0.8;
    }
    .course-name {
      color: #fff;
      margin-left: 17rpx;
      font-size: $uni-font-size-base;
    }
  }
  &-card {
    margin: 0 40rpx 40rpx 40rpx;
    border-radius: 12rpx;
    color: #fff;
    box-shadow: 0 0 6px #199fff;
    &-header {
      padding: 32rpx;
      border-top-left-radius: 12rpx;
      border-top-right-radius: 12rpx;
      background: linear-gradient(to right, #11c2fa, #4087f5);
      &-title {
        display: flex;
        justify-content: space-between;
        font-size: $uni-font-size-md;
      }
      &-tabs {
        padding-top: 20rpx;
        display: flex;
        .tab-item {
          width: 33%;
          text-align: center;
          &-title {
            opacity: 0.8;
          }
          &-value text {
            font-size: 48rpx;
          }
        }
      }
    }
    &-content {
      height: 400rpx;
      border-bottom-left-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
      background-color: #fff;
      .charts-box {
        height: 380rpx;
      }
      &.block {
        display: flex;
        flex-wrap: wrap;
        color: #000;
        .block-item {
          width: 40%;
          margin: 30rpx;
          border-radius: 12rpx;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          .block-item-value text {
            font-size: 48rpx;
          }
          &.primary {
            background-color: #f2fdff;
            .block-item-value {
              color: #199fff;
            }
          }
          &.success {
            background-color: #f3fef4;
            .block-item-value {
              color: #2bc83a;
            }
          }
          &.warning {
            background-color: #fffbf2;
            .block-item-value {
              color: #ff7d31;
            }
          }
          &.danger {
            background-color: #f7f8ff;
            .block-item-value {
              color: #5a66e6;
            }
          }
        }
      }
    }
  }
}
</style>