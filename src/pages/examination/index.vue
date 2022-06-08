<template>
  <view class="examination">
    <view class="logan-list-head">
      <view class="logan-list-head-left" @click="onCandidates">
        <text>{{ activeQuestionBank }}</text>
        <uni-icons type="bottom" size="32rpx" />
      </view>
    </view>

    <view class="report">
      <view class="report-top">
        <view class="report-top-title">每日学习，为梦想持续加码</view>
        <view class="report-top-data">
          <view class="report-top-col">
            <text class="data-number">{{statistics.answer_days | empty}}天</text>
            <text class="data-desc">累计答题天数</text>
          </view>
          <view class="spacing" style="width: 2rpx; height: 75rpx; background-color: #fff;"></view>
          <view class="report-top-col">
            <text class="data-number">{{statistics.today_answer_num | empty}}</text>
            <text class="data-desc">今日答题数</text>
          </view>
          <view class="spacing" style="width: 2rpx; height: 75rpx; background-color: #fff;"></view>
          <view class="report-top-col">
            <text class="data-number">{{statistics.today_correct_rate | empty}}%</text>
            <text class="data-desc">今日正确率</text>
          </view>
        </view>
      </view>
      <view class="report-bottom">
        <view class="report-bottom-left">
          <image src="/static/img/examination_icon_person.png" mode="aspectFit" class="icon-person" />
          <text class="text-person">{{statistics.learning_num | empty}}人正在学习</text>
        </view>
        <view class="report-bottom-right">
          <button class="report-bottom-btn" @click="goStudy">今日未学习</button>
        </view>
      </view>
    </view>

    <view class="grids">
      <uni-grid :column="4" :showBorder="false" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item">
          <view class="grid-box" @click="() => to(grid.url)">
            <image :src="grid.thumb" class="grid-image" mode="aspectFit" />
            <text class="grid-text">{{ grid.title }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="examinationcard-bar">
      <view class="examinationcard-list">
        <view v-for="(examination) in examinations" :key="examination.id" class="examinationcard-list-item">
          <ExaminationCard @click="() => to(examination.url)" :leftImage="examination.thumb"
                           :rightTop="examination.name" :rightFooter="examination.desc" :bgColor="examination.bgColor">
            <template v-slot:arrow>
              <image :src="examination.arrow" mode="aspectFit" class="arrow-image" />
            </template>
          </ExaminationCard>
        </view>
      </view>
    </view>

    <uni-popup ref="popupRef" type="bottom" @change="openPopupChange">
      <view class="popup-box">
        <uni-list>
          <view class="list-item-body-title">请选择题库</view>
          <uni-list-item v-for="(item, index) in candidates" :key="index" @click="() => onClickItem(index)" clickable>
            <template v-slot:body>
              <view class="list-item-body-test">{{ item.title }}</view>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </uni-popup>
  </view>
</template>

<script>
import ExaminationCard from './components/ExaminationCard'
import { browser, userStatus } from '@/mixins/index'
import {
  getQuestionBankList,
  getDailyStatistics
} from '@/api/question'

export default {
  mixins: [browser, userStatus],
  components: {
    ExaminationCard
  },
  data() {
    return {
      // 组合框
      currentCandidates: 0,
      candidates: [],
      // 宫格数据
      gridIndex: 0,
      grids: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird1.png", title: "收藏夹", url: "/pages/examinations/favorites/index" },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird2.png", title: "错题集", url: "/pages/examinations/wrongQuestion/index" },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird3.png", title: "学习报告", url: "/pages/examinations/learnReport/index" },
        { id: 4, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination_gird4.png", title: "考试记录", url: "/pages/examinations/examinationRecord/index" },
      ],
      // 推荐课程
      examinations: [
        { id: 1, name: "章节练习", desc: '章节阶段练习，提升自身能力', bgColor: '#FFFAF4', arrow: '/static/img/examination_bg_list1.png', thumb: '/static/img/examination_icon_list2.png', url: "/pages/examinations/chapterList/index" },
        { id: 2, name: "模拟考试", desc: '仿真考试训练，智能组卷测评', bgColor: '#FFF7F7', arrow: '/static/img/examination_bg_list2.png', thumb: '/static/img/examination_icon_list1.png', url: '/pages/examinations/examinationMock/index' },
      ],
      // 轮播
      swipers: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/examination-swiper.png", url: "" }
      ],
      isReady: false,
      question_bank_id: '',
      questionBankInfo: '请选择题库',
      activeQuestionBank: '',

      statistics: {
        answer_days: 0,
        today_answer_num: 0,
        today_correct_rate: 0,
        learning_num: 0,
      },
      isLoad: false
    };
  },
  onLoad() {
    if (!this.isLoad) {
      this.init()
    }
  },
  onShow() {
    if (this.isLoad) {
      this.init()
    } else {  
      this.isLoad = true
    }
  },  
  methods: {
    init() {
      this.questionBankInfo = this.$store.getters.questionBankInfo
      this.question_bank_id = this.questionBankInfo.id
      this.setActiveQuestionBank()
      this.getQuestionBankList()
    },
    to(url) {
      if (this.authority()) {
        uni.navigateTo({ url })
      }
    },
    goStudy() {
      if (this.authority()) {
        uni.navigateTo({ url: '/pages/examinations/chapterList/index' })
      }
    },
    onCandidates(e) {
      this.$refs.popupRef.open()
    },
    openPopupChange({ show }) {
      if (show) {
        uni.hideTabBar()
      } else {
        uni.showTabBar()
      }
    },
    onClickItem(index) {
      let questionBankInfo = this.candidates[index]
      this.currentCandidates = index
      this.questionBankInfo = questionBankInfo
      this.$store.commit('SET_QUESTION_BANK_INFO', questionBankInfo)
      this.setActiveQuestionBank()
      this.$refs.popupRef.close()
    },
    setActiveQuestionBank() {
      let questionBankInfo = this.questionBankInfo
      if (questionBankInfo.id) {
        this.question_bank_id = questionBankInfo.id
        this.activeQuestionBank = questionBankInfo.title
      } else {
        this.activeQuestionBank = '请选择题库'
      }
    },
    async getQuestionBankList() {
      let res = await getQuestionBankList()
      if (res.code === 0) {
        this.candidates = res.data
      }
      this.getDailyStatistics()
    },
    async getDailyStatistics() {
      let question_bank_id = this.question_bank_id
      let params = { question_bank_id }
      let res = await getDailyStatistics(params)
      if (res.code === 0) {
        this.statistics = res.data
      }
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$padding-tb: 16rpx;
$padding-lr: 30rpx;

.examination {
  height: 100%;
  overflow: hidden;
  overflow-y: scroll;
  padding: $padding-tb 0;
}

.head-swiper {
  padding: 0 30rpx;

  .swiper {
    width: 100%;
    height: 280rpx; // 同时控制着轮播图
  }

  .swiper-image {
    width: 100%;
    height: 100%;
    border-radius: 20rpx;
  }
}

.report {
  padding: 0 30rpx;

  &-top {
    padding: 30rpx;
    color: #fff;
    border-top-left-radius: 24rpx;
    border-top-right-radius: 24rpx;
    background-color: #199fff;

    &-title {
      font-size: $font-size-md;
    }

    &-data {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      margin: 30rpx 0 0 20rpx;
    }

    &-col {
      display: flex;
      flex-direction: column;
      align-items: center;

      .data-number {
        font-size: 48rpx;
        font-weight: 500;
      }

      .data-desc {
        font-size: $font-size-sm;
        line-height: calc(2 * $font-size-sm);
        font-weight: 300;
      }
    }
  }

  &-bottom {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 30rpx;
    box-shadow: 0 10rpx 20rpx #def1ff;

    &-left {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-btn {
      color: #fff;
      font-size: $font-size-sm;
      border-radius: 12rpx;
      background-color: $color-primary;
    }

    .icon-person {
      width: 140rpx;
      height: 60rpx;
    }

    .text-person {
      margin-left: 22rpx;
      font-size: $font-size-sm;
      color: $text-color-grey;
    }
  }
}

.examinationcard-bar {
  padding: 0 30rpx;
}

.examinationcard-list-item {
  margin-top: 20rpx;
  border: 2rpx solid $border-color-spacing;
}

.bg-1 {
  background-color: #fffaf4;
}

.bg-2 {
  background-color: #fff7f7;
}

.arrow-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 72rpx;
  height: 72rpx;
}

.grids {
  margin-top: 40rpx;
  padding: 20rpx;
}

.grid {
  &-item {
    flex: 1;
  }

  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  &-image {
    width: 70rpx;
    height: 70rpx;
    border-radius: 10rpx;
  }

  &-text {
    margin-top: 20rpx;
    font-size: $font-size-base;
  }
}

.popup-box {
  margin-bottom: calc(var(--window-bottom) + constant(safe-area-inset-bottom));
  margin-bottom: calc(var(--window-bottom) + env(safe-area-inset-bottom));
}

.list-item-body-title {
  width: 100%;
  height: 84rpx;
  text-align: center;
  line-height: 84rpx;
  font-size: $font-size-base;
  color: $color-primary;
  border: 2rpx solid #eee;
}

.list-item-body-test {
  width: 100%;
  font-size: 28rpx;
  text-align: center;
}
</style>