<template>
  <view class="test-results">
    <view class="results-header">
      <view class="score">
        <image class="score-img" src="../static/icon-water.png"></image>
        <view class="score-title">最终得分</view>
        <view class="score-value">{{ testResult.info.mark || 0 }}</view>
      </view>
      <view class="topics">
        <view class="topics-number topics-number--success">
          <text class="title">正确题数：</text>
          <text class="number">{{ testResult.info.right_problem || 0 }}</text>
        </view>
        <view class="topics-number topics-number--error">
          <text class="title">错误题数：</text>
          <text class="number">{{ testResult.info.fail_problem || 0 }}</text>
        </view>
        <view class="topics-number topics-number--none">
          <text class="title">未答题数：</text>
          <text class="number">{{ testResult.info.unanswered || 0 }}</text>
        </view>
      </view>
    </view>
    
    <view class="results-container">
      <view v-for="(item, type) in listData" :key="type">
        <Title>{{ typeMap[type] }}</Title>
        <view class="circular-list">
          <template v-if="type == 7">
            <template v-for="(parent, parentIndex) in item">
              <Circular v-for="(child, index) in parent.child" :key="child.id"
                        :type="statusMap[model][child.is_answered]" @click="onSelect(type, parentIndex)">
                {{parentIndex + 1}}-{{ index + 1 }}
              </Circular>
            </template>
          </template>
          <template v-else>
            <Circular v-for="(question, index) in item" :key="question.id"
                      :type="statusMap[model][question.is_answered]" @click="onSelect(type, index)">
              {{ index + 1 }}
            </Circular>
          </template>
        </view>
      </view>
    </view>
    <view class="results-footer">
      <view class="btn" @click="goBack">查看全部解析</view>
    </view>
  </view>
</template>

<script>
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Title from "../components/title/index";
import Circular from "../components/circular/index";
import { getExamAnswerSheet } from "@/api/question";

export default {
  name: "answerSheet",
  components: {
    Title,
    Header,
    Footer,
    Circular,
  },
  data() {
    return {
      model: "1", // 1 刷题 2，考试 3 答题后的解析
      chapter_id: 0,
      question_bank_id: 0,
      source: '',
      isAnalysis: '',
      listData: {},
      statusMap: {
        1: {
          "0": "none",
          "1": "success",
          "2": "error",
        },
        2: {
          "0": "none",
          "1": "primary",
          "2": "primary",
        },
        3: {
          "0": "none",
          "1": "success",
          "2": "error",
        },
      },
      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "不定项题",
        4: "判断题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
    };
  },
  onLoad({ chapter_id, question_bank_id, source, isAnalysis }) {
    this.chapter_id = chapter_id
    this.question_bank_id = question_bank_id
    this.source = source
    this.isAnalysis = isAnalysis
    this.getQuestionBoard();
  },
  methods: {
    onSelect(type, index) {
      let types = this.listData[type]
      let question_id = types[index].id
      let chapter_id = this.chapter_id
      let question_bank_id = this.question_bank_id
      let url = `/pages/examinations/selfQuestion/answer/index`
      let query = `?chapterId=${chapter_id}&question_bank_id=${question_bank_id}&question_id=${question_id}&isReview=1&source=${this.source}&isAnalysis=${this.isAnalysis}`
      uni.redirectTo({ url: url + query })
    },
    handleSubmit() {
      uni.showModal({
        title: '提示',
        content: '您还有题未作答，确认交卷吗？',
        success: ({ confirm }) => {
          if (confirm) {
            uni.navigateBack()
          }
        }
      });
    },
    handleClick() {
      this.goBack();
    },
    goBack() {
      uni.navigateBack();
    },
    async getQuestionBoard() {
      let data = { question_bank_id: this.question_bank_id, chapter_id: this.chapter_id }
      const res = await getExamAnswerSheet(data);
      this.listData = res.data.list;
    },
  },
};
</script>
<style lang="scss" scoped>
.test-results {
  padding: 40rpx;
  padding-bottom: 160rpx;
  .results-header {
    padding: 35rpx 20rpx 35rpx 35rpx;
    border-radius: 16rpx;
    box-shadow: 0 0 10rpx rgba(93, 207, 255, 0.3);
    display: flex;
    margin-bottom: 60rpx;
    .score {
      width: 266rpx;
      height: 230rpx;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      align-items: center;
      color: #fff;
      &-img {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
      }
      &-title {
        color: $uni-color-primary;
        margin-top: 10rpx;
      }
      &-value {
        font-size: 60rpx;
        margin-bottom: 20rpx;
      }
    }
    .topics {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 1;
      margin-left: 20rpx;
      &-number {
        display: flex;
        align-items: center;
        color: #999999;
        font-size: 30rpx;
        padding-bottom: 20rpx;
        border-bottom: 1rpx solid #e3e3e3;
        .title {
          margin-left: 16rpx;
        }
        &::before {
          content: "";
          width: 32rpx;
          height: 32rpx;
          border-radius: 50%;
        }
        &--success {
          &::before {
            background-color: $uni-answer-success;
          }
          .number {
            color: $uni-answer-success;
          }
        }
        &--error {
          &::before {
            background-color: $uni-answer-error;
          }
          .number {
            color: $uni-answer-error;
          }
        }
        &--none {
          &::before {
            background-color: #ddd;
          }
        }
      }
    }
  }
  .results-container {
    .circular-list {
      display: flex;
      flex-wrap: wrap;
    }
  }
  .results-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 0 20rpx;
    border-top: $uni-border;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100rpx;
    padding-bottom: constant(safe-area-inset-bottom);
    padding-bottom: env(safe-area-inset-bottom);
    background-color: #fff;
    .btn {
      color: #fff;
      background-color: $uni-color-primary;
      padding: 10rpx 0;
      width: 300rpx;
      text-align: center;
      border-radius: 10rpx;
      &:active {
        opacity: 0.8;
      }
    }
  }
}
</style>