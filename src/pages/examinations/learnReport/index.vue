<template>
  <view class="learn-report">
    <view class="learn-report-header">
      <view class="status_bar"></view>
      <view class="nav-bar">
        <uni-icons class="nav-bar-back" type="back" @click="goBack" color="#fff" size="16px"></uni-icons>
        <text class="nav-bar-title">学习报告</text>
      </view>
    </view>
    <view class="learn-report-container">
      <view class="learn-report-statistics">
        <view class="statistics-top">
          <view class="statistics-top-user">
            <image class="user-avatar" :src="userInfo.avatar_url" />
            <view>
              <view class="user-name">{{userInfo.real_name}}</view>
              <view class="user-time">{{practiceData.first_time_study}} 开始学习</view>
            </view>
          </view>
          <view class="statistics-top-day">
            <p class="day-title">今日答题数</p>
            <p class="day-value">{{practiceData.today_answer_num}}</p>
          </view>
        </view>
        <view class="statistics-data">
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{practiceData.today_correct_rate | empty}}%</view>
            <view class="statistics-data-item-title">今日正确率</view>
          </view>
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{practiceData.collect_num | empty}}<text></text></view>
            <view class="statistics-data-item-title">收藏题数</view>
          </view>
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{practiceData.wrong_num | empty}}</view>
            <view class="statistics-data-item-title">答错题数</view>
          </view>
        </view>
      </view>
      <view class="learn-report-card">
        <view class="learn-report-card-header">
          <view class="card-title">人工组卷</view>
          <view class="card-icon">
            <view class="card-icon-radio c-1"></view>
            <view class="card-icon-radio c-2"></view>
            <view class="card-icon-radio c-3"></view>
          </view>
        </view>
        <view class="learn-report-card-contetn">
          <view class="charts-gauge-box">
            <qiun-data-charts type="gauge" :chartData="chartGaugeData" :opts="chartGaugeOpts" />
          </view>
        </view>
        <view class="learn-report-card-statistics statistics-data">
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{customData.total_answer_num | empty}}</view>
            <view class="statistics-data-item-title">答题总数</view>
          </view>
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{customData.answer_progress | empty}}<text>%</text></view>
            <view class="statistics-data-item-title">答题进度</view>
          </view>
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{customData.total_exam_num | empty}}</view>
            <view class="statistics-data-item-title">总考试次数</view>
          </view>
          <view class="statistics-data-item none">
            <view class="statistics-data-item-value">{{customData.top_score | empty}}</view>
            <view class="statistics-data-item-title">最高得分</view>
          </view>
        </view>
      </view>
      <view class="learn-report-card">
        <view class="learn-report-card-header">
          <view class="card-title">随机考试</view>
          <view class="card-icon">
            <view class="card-icon-radio c-1"></view>
            <view class="card-icon-radio c-2"></view>
            <view class="card-icon-radio c-3"></view>
          </view>
        </view>
        <view class="learn-report-card-contetn">
          <view class="charts-line-title">最近7次模拟考试成绩</view>
          <view class="charts-line-box">
            <qiun-data-charts type="line" :chartData="chartLineData" :opts="chartsLineOpts" />
          </view>
        </view>
        <view class="learn-report-card-statistics statistics-data">
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{mockData.total_exam_num | empty}}</view>
            <view class="statistics-data-item-title">模拟考试次数</view>
          </view>
          <view class="statistics-data-item">
            <view class="statistics-data-item-value">{{mockData.total_answer_num | empty}}</view>
            <view class="statistics-data-item-title">累计答题总数</view>
          </view>
          <view class="statistics-data-item none">
            <view class="statistics-data-item-value">{{mockData.top_score | empty}}</view>
            <view class="statistics-data-item-title">模拟考试最高分</view>
          </view>
        </view>
      </view>
    </view>

  </view>
</template>

<script>
import qiunDataCharts from "@/uni_modules/ucharts/components/qiun-data-charts/qiun-data-charts.vue";
import moment from '@/utils/date'
import { 
  getDailyStatistics,
  getStudyReport
 } from '@/api/question'


export default {
  components: {
    qiunDataCharts,
  },
  filters: {
    dayFormat(val) {
      return new Date(val).getDay()
    },
    dateFormat(val) {
      let date = new Date(val) 
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDay()}` 
    }
  },
  data() {
    return {
      srcImage: 'https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',

      userInfo: {},
      todyData: {},
      practiceData: {},
      mockData: {},
      customData: {},
        
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
            "data": 0
          }
        ]
      },

      chartGaugeOpts: {
        subtitle: {
          name: '0%',
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

      chartLineData: {
        categories: [],
        series: [{ name: '考试成绩', data: [] }],
      },

      chartsLineOpts: {
        legend: {
          show: false,
        },
        extra: {
          line: { type: "curve", width: 2 },
        }
      },
    };
  },
  onLoad() {
    this.userInfo = this.$store.getters.userInfo
    this.getDailyStatistics()
    this.getStudyReport()
  },
  created() {
    // setTimeout(() => {
    //   this.chartGaugeOpts.subtitle.name = '20%'
    //   this.chartGaugeData.series[0].data = 0.2
    // }, 2000);
  },
  methods: {
    goBack() {
      uni.navigateBack();
    },

    fullData(mockData, correct_rate) {
      this.chartGaugeOpts.subtitle.name = `${correct_rate}%`
      this.chartLineData.series[0].data = parseFloat(correct_rate) / 100

      this.chartLineData.categories = mockData.map(item => item.time)
      this.chartLineData.series[0].data = mockData.map(item => +item.score)

      console.log('mock', mockData, this.chartLineData,);
      
    },

    async getDailyStatistics() {
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let params = {question_bank_id} 
      let res = await getDailyStatistics(params)
      if (res.code === 0) {
        this.todyData = res.data
      }
    },

    async getStudyReport() {
      let question_bank_id = this.$store.getters.questionBankInfo.id
      let params = {question_bank_id} 
      let res = await getStudyReport(params)
      if (res.code === 0) {
        let { practice, custom, mock} = res.data
        this.practiceData = practice   
        this.mockData = mock
        this.customData = custom
        let mockData = mock.chart_list.slice(0, 7) 
        this.fullData(mockData, custom.correct_rate)
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.learn-report {
  background: url("http://dpsystem.oss-cn-shenzhen.aliyuncs.com/moren1607659060/132ab6092475c66a9406898d4cfacb78")
    no-repeat;
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
          font-size: $uni-font-size-md;
        }
      }
    }
  }
  &-container {
    height: calc(100vh - 44px - var(--status-bar-height));
    overflow-y: auto;
  }
  &-header {
    .status_bar {
      height: var(--status-bar-height);
      width: 100%;
    }
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
  &-statistics {
    height: 722rpx;
    padding: 50rpx;
    margin-top: 30rpx;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: url("http://dpsystem.oss-cn-shenzhen.aliyuncs.com/moren1607659060/d4db137eff2370675dac5242d529074a")
      no-repeat center center;
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
          font-size: 80rpx;
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
        font-size: $uni-font-size-lg;
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