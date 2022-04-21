<template>
  <view class="learn-report">
    <view class="learn-report-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="20"></uni-icons>
        <text class="nav-bar-title">学习报告</text>
      </view>
    </view>
    <div class="learn-report-container">

      <div class="learn-report-statistics">
        <div class="statistics-top">
          <div class="statistics-top-user">
            <image class="user-avatar"
                   :src="srcImage" />
            <div>
              <div class="user-name">娿饿肚肚</div>
              <div class="user-time">2021-20-20 开始学习</div>
            </div>
          </div>
          <div class="statistics-top-day">
            <p class="day-title">累计答题天数</p>
            <p class="day-value">255</p>
          </div>
        </div>
        <div class="statistics-data">
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">今日答题数</div>
          </div>
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999<text>%</text></div>
            <div class="statistics-data-item-title">今日正确率</div>
          </div>
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">总答题数</div>
          </div>
          <div class="statistics-data-item none">
            <div class="statistics-data-item-value">9999<text>%</text></div>
            <div class="statistics-data-item-title">总正确率</div>
          </div>
        </div>
      </div>
      <div class="learn-report-card">
        <div class="learn-report-card-header">
          <div class="card-title">章节练习</div>
          <div class="card-icon">
            <div class="card-icon-radio c-1"></div>
            <div class="card-icon-radio c-2"></div>
            <div class="card-icon-radio c-3"></div>
          </div>
        </div>
        <div class="learn-report-card-contetn">
          <view class="charts-gauge-box">
            <qiun-data-charts type="gauge" :chartData="chartGaugeData" :opts="chartGaugeOpts" />
          </view>
        </div>
        <div class="learn-report-card-statistics statistics-data">
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">答题总数</div>
          </div>
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999<text>%</text></div>
            <div class="statistics-data-item-title">答题进度</div>
          </div>
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">收藏题数</div>
          </div>
          <div class="statistics-data-item none">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">答错题数</div>
          </div>
        </div>
      </div>
      <div class="learn-report-card">
        <div class="learn-report-card-header">
          <div class="card-title">模拟考试</div>
          <div class="card-icon">
            <div class="card-icon-radio c-1"></div>
            <div class="card-icon-radio c-2"></div>
            <div class="card-icon-radio c-3"></div>
          </div>
        </div>
        <div class="learn-report-card-contetn">
          <div class="charts-line-title">最近7次模拟考试成绩</div>
          <view class="charts-line-box">
            <qiun-data-charts type="line" :chartData="chartLineData" :opts="chartsLineOpts" />
          </view>
        </div>
        <div class="learn-report-card-statistics statistics-data">
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">模拟考试次数</div>
          </div>
          <div class="statistics-data-item">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">累计答题总数</div>
          </div>
          <div class="statistics-data-item none">
            <div class="statistics-data-item-value">9999</div>
            <div class="statistics-data-item-title">模拟考试最高分</div>
          </div>
        </div>
      </div>
    </div>

  </view>
</template>

<script>
import qiunDataCharts from "@/uni_modules/ucharts/components/qiun-data-charts/qiun-data-charts.vue";
export default {
  components: {
    qiunDataCharts,
  },
  data() {
    return {
      srcImage: 'https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
      chartsLineOpts: {
        legend: {
          show: false,
        },
        extra: {
          line: {
            type: "curve",
            width: 2
          },
        }
      },
      chartLineData: {
        categories: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
        series: [
          {
            name: "目标值",
            data: [35, 36, 31, 33, 13, 34, 5],
          },
        ],
      },
      chartGaugeOpts: {
        subtitle: {
          name: '50%',
          offsetY: 30,
          color: '#ffcc2d'
        },
        title: {
          name: '答题正确率',
          fontSize: 12,
          offsetY: 70,
          color: '#111'
        }
      },
      chartGaugeData: {
        categories: [
          {
            "value": 0.3,
            "color": "#ff5b5d"
          },
          {
            "value": 0.7,
            "color": "#ffcc2d"
          },
          {
            "value": 1,
            "color": "#5b9cff"
          }
        ],
        series: [
          {
            "name": "完成率",
            "data": 0.5
          }
        ]
      },
    };
  },
  created() {
    setTimeout(() => {
      this.chartGaugeOpts.subtitle.name = '20%'
      this.chartGaugeData.series[0].data = 0.2
    }, 2000);
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.learn-report {
  padding-bottom: 40rpx;
  background: url("../../static/learn-report-background.png") no-repeat;
  background-size: cover;
  .statistics-data {
    display: flex;
    background-color: #fff;
    &-item {
      flex: 1;
      text-align: center;
      border-right: 2rpx solid #e4e4e4;
      font-size: $uni-font-size-sm;
      &.none {
        border-right: none;
      }
      &-title {
        color: #6d6d6d;
      }
      &-value {
        font-size: 50rpx;
        color: $uni-color-primary;
        text {
          font-size: $uni-font-size-sm;
        }
      }
    }
  }
  &-container {
    height: calc(100vh - 44px);
    overflow-y: auto;
  }
  &-header {
    .nav-bar {
      height: 44px;
      font-size: $uni-font-size-base;
      display: flex;
      align-items: center;
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
  &-statistics {
    height: 722rpx;
    padding: 50rpx;
    margin-top: 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url("../../static/learn-report.png") no-repeat center center;
    background-size: contain;
    .statistics-top {
      height: 400rpx;
      padding: 0 20rpx;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      &-user {
        display: flex;
        align-items: center;
        .user-avatar {
          border-radius: 50%;
          width: 88rpx;
          height: 88rpx;
          margin-right: 20rpx;
        }
        .user-name {
          font-size: 30rpx;
          color: #121212;
          font-weight: 550;
        }
        .user-time {
          font-size: $uni-font-size-sm;
          color: #868686;
        }
      }
      &-day {
        text-align: center;
        .day-title {
          font-size: $uni-font-size-sm;
        }
        .day-value {
          font-size: 85rpx;
          color: $uni-color-primary;
          font-weight: bold;
        }
      }
    }
  }
  &-card {
    margin: 40rpx;
    padding-bottom: 40rpx;
    background-color: #fff;
    border-radius: 14rpx;
    &-header {
      display: flex;
      justify-content: space-between;
      padding: 32rpx;
      border-top-left-radius: 12rpx;
      border-top-right-radius: 12rpx;
      background: linear-gradient(to right, #11c2fa, #4087f5);
      .card-title {
        font-size: $uni-font-size-xlg;
        color: #fff;
      }
      .card-icon {
        width: 100rpx;
        display: flex;
        align-items: center;
        justify-content: space-around;
        &-radio {
          width: 20rpx;
          height: 20rpx;
          border-radius: 50%;
        }
        .c-1 {
          background-color: #fff;
        }
        .c-2 {
          background-color: #fef800;
        }
        .c-3 {
          background-color: #00ffe4;
        }
      }
    }
    &-contetn {
      .charts-line-title {
        padding: 32rpx;
        font-size: 30rpx;
        color: #303232;
        display: flex;
        align-items: center;
        &::before {
          content: "";
          width: 8rpx;
          height: 32rpx;
          background-color: $uni-color-primary;
          margin-right: 8rpx;
        }
      }
      .charts-line-box {
        height: 400rpx;
        padding-bottom: 40rpx;
      }
      .charts-gauge-box {
        padding-top: 20rpx;
        height: 500rpx;
      }
    }
    &-statistics {
      border-bottom-left-radius: 12rpx;
      border-bottom-right-radius: 12rpx;
    }
  }
}
</style>