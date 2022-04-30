<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].topic_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.topic_type === 7 }"
                   v-for="(item, index) in questionList" :key="index">
        <block v-if="
            currentIndex === index ||
            currentIndex - 1 === index ||
            currentIndex + 1 === index
          ">
          <Single :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 1" />
          <Multiple :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 2" />
          <Judg :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 3" />
          <Indefinite :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 4" />
          <Completion :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 5" />
          <Short :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 6" />
          <Case :model="model" :options="item" :serial-number="currentIndex + 1" :log-id="logId"
                v-if="item.topic_type === 7" :ref="`case-${item.id}`"
                :is-active="currentIndex === index && duration === 300" :type="type" @change="onCaseChange"
                @index-change="onCaseIndexChange" />
        </block>
      </swiper-item>
    </swiper>
    <AnswerBar class="bar" :model="model" :is-end="isEnd" :is-start="isStart" :time="time"
               :isCollection="!!getCurrentData.is_collection" @submit-paper="toTestResoult" @card="toCard"
               @next="handleNext" @prev="handlePrev" @collect="setCollection" @timeup="onTimeUp">
    </AnswerBar>
  </view>
</template>
<script>
import AnswerBar from "../components/answerBar";
import AnswerHead from "../components/answerHead";
import Single from "../components/single";
import Multiple from "../components/multiple";
import Judg from "../components/judg";
import Indefinite from "../components/indefinite";
import Completion from "../components/completion";
import Short from "../components/short";
import Case from "../components/case";

import {
  createPractice,
  submitAnswer,
  settlement,
  setCollection,
  createMockExam,
  createRealTopic,
  createIndependent,
  createDailyClock,
  createChallenge,
  getUserTopicRecord,
  submitWrongQuestion,
} from "@/api/question";
// import { mapActions } from "vuex";
export default {
  name: "answer",
  components: {
    AnswerHead,
    AnswerBar,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    Case,
  },

  data() {
    return {
      // 当前的swiper 索引
      currentIndex: 0,
      // 案例题的swiper 索引
      caseIndex: 0,
      // swiper 动画时间
      duration: 300,
      total: 0,
      questionList: [],
      logId: "",
      userAnswerMap: {},
      // 练习的题目类型
      type: 1, // 1:章节练习，2：模拟考试 ...
      // 是否结算
      hasSettlement: false,
      // 答题模式
      model: "1",
      // 倒计时时间
      time: 0,
      // 收藏夹&错题集 是否是解析模式
      isAnalysis: 0,
      // 历年真题是否是考试模式
      isExam: 0,
    };
  },
  computed: {
    // 获取当前显示的题目。案例题按小题算
    getCurrentData() {
      const currentData = this.questionList[this.currentIndex];
      if (!currentData) {
        return {};
      }
      return currentData.topic_type === 7
        ? currentData.child[this.caseIndex]
        : currentData;
    },
    // 是否最后一题
    isEnd() {
      return !!this.total && this.currentIndex >= this.total - 1
    },
    isStart() {
      return this.currentIndex <= 0
    }
  },
  onShow() {
    this.duration = 300;
    this.setCurrentModel();
  },
  onLoad({
    chapterId,
    title = "题目",
    type = "1",
    time = 0,
    isExam,
    isAnalysis,
    isContinue,
  }) {
    this.type = type;
    this.time = +time;
    this.isExam = isExam;
    this.isAnalysis = isAnalysis;
    uni.setNavigationBarTitle({
      title,
    });
    this.createQuestion(chapterId, isExam, isContinue);
  },
  onUnload() {
    if (!["7", "8"].includes(this.type)) {
      this.submitOtherAnswer().then(() => {
        this.settlement();
      });
    }
  },
  methods: {
    // ...mapActions(["setQusetionList"]),
    setCurrentModel() {
      // model 1:刷题模式，2：考试模式 3：解析模式
      if (this.type === "1") {
        this.model = "1";
      }
      if (this.type === "2") {
        this.model = "2";
        if (this.hasSettlement) {
          this.model = "3";
        }
      }
      if (this.type === "3") {
        if (this.isExam === "1") {
          this.model = "2";
          if (this.hasSettlement) {
            this.model = "3";
          }
        } else {
          this.model = "1";
        }
      }
      if (this.type === "4") {
        this.model = "2";
        if (this.hasSettlement) {
          this.model = "3";
        }
      }
      if (this.type === "5") {
        this.model = "1";
      }
      if (this.type === "6") {
        this.model = "1";
      }
      if (this.type === "7") {
        this.model = "1";
        if (this.isAnalysis === "1") {
          this.model = "3";
        }
      }
      if (this.type === "8") {
        this.model = "1";
        if (this.isAnalysis === "1") {
          this.model = "3";
        }
      }
    },
    onTimeUp() {
      this.model === "2" && uni.showModal({
        title: '提示',
        showCancel: false,
        content: '考试时间到，系统自动交卷',
        success: ({ confirm }) => {
          if (confirm) {
            this.toTestResoult();
          }
        }
      });
    },
    // 提交其他题型答案
    submitOtherAnswer() {
      return new Promise(async (resolve) => {
        if (this.type === "7" || this.hasSettlement) {
          // 收藏夹，结算过 不用提交答案
          return resolve();
        }
        for (const id in this.userAnswerMap) {
          if (Array.isArray(this.userAnswerMap[id])) {
            this.userAnswerMap[id].length &&
              (await this.submitAnswer(id, this.userAnswerMap[id]));
          } else {
            this.userAnswerMap[id] &&
              (await this.submitAnswer(id, this.userAnswerMap[id]));
          }
        }
        resolve();
      });
    },
    // 案例题里的index
    onCaseIndexChange(index) {
      this.caseIndex = index;
    },
    // 案例题的用户答案
    onCaseChange(index, answer) {
      this.questionList[this.currentIndex].child[index].userAnswer = answer;
    },
    // 收集其他题型答案
    onOtherChange(answer, id) {
      this.userAnswerMap[id] = answer;
      this.questionList[this.currentIndex].userAnswer = answer;
    },
    // 单选跟判断题答案提交
    onSingleChange(answer, id) {
      // 收藏夹不用提交答案
      if (this.type !== "7") {
        this.submitAnswer(id, [answer]);
      }
      this.questionList[this.currentIndex].userAnswer = answer;
      this.model === "2" && this.handleNext();
    },
    handlePrev() {
      !this.isStart && this.currentIndex--;
    },
    handleNext() {
      !this.isEnd &&
        this.currentIndex++;
    },
    onAnimationfinish({ detail }) {
      this.submitOtherAnswer();
    },
    onSwiperChange({ detail }) {
      const { current } = detail;
      this.currentIndex = current;
      this.caseIndex = 0;
      this.onSwiperBoundary();
    },
    onSwiperBoundary() {
      if (this.isStart) {
        uni.showToast({
          icon: "none",
          title: "已经是第一题了",
        });
        return
      }
      if (this.isEnd) {
        uni.showToast({
          icon: "none",
          title: "已经是最后一题了",
        });
      }
    },
    // 题目收藏
    async setCollection() {
      const { id: topic_id, is_collection } = this.getCurrentData;
      const data = {
        topic_id,
        is_collection: +!is_collection,
      };
      const res = await setCollection(data);
      this.getCurrentData.is_collection = data.is_collection;
      uni.showToast({
        title: res.message,
        icon: 'none'
      });
    },
    // 结算成绩
    async settlement() {
      const data = {
        log_id: this.logId,
      };
      await settlement(data);
    },
    // 提交答案
    async submitAnswer(topic_id, answer) {
      const data = {
        log_id: this.logId,
        topic_id,
        answer,
      };
      // 错题集答案提交用 submitWrongQuestion
      const api = this.type === "8" ? submitWrongQuestion : submitAnswer;
      await api(data);
      // 已提交的重置掉
      this.userAnswerMap[topic_id] && (this.userAnswerMap[topic_id] = null);
    },
    // 获取章节练习题目
    async createQuestion(chapter_id, is_exam, redo) {
      const data = {
        chapter_id,
        is_exam,
        redo,
      };
      if (this.type === "7") {
        data.is_collection = 1; // 收藏夹
      }
      if (this.type === "8") {
        data.is_collection = 0; // 错题集
      }
      const api = {
        1: createPractice,
        2: createMockExam,
        3: createRealTopic,
        4: createIndependent,
        5: createDailyClock,
        6: createChallenge,
        7: getUserTopicRecord,
        8: getUserTopicRecord,
      };
      const res = await api[this.type](data);
      const topic_list = res.data.topic_list;
      const topic_id = res.data.topic_id || "";
      const qusetionType = [1, 2, 3, 4, 5, 6, 7];
      qusetionType.forEach((type) => {
        this.questionList = this.questionList.concat(topic_list[type] || []);
      });
      // 继续上一次
      topic_id &&
        this.questionList.forEach((item, index) => {
          if (item.id === topic_id) {
            this.currentIndex = index;
          }
        });
      this.total = res.data.total;
      this.logId = res.data.log_id;
      // 收藏夹错题集的答题卡数据
      if (["7", "8"].includes(this.type)) {
        // this.setQusetionList(topic_list);
      }
    },
    toTestResoult() {
      this.submitOtherAnswer();
      this.duration = 0;
      this.hasSettlement = true;
      setTimeout(() => {
        uni.navigateTo({
          url: `/pages/examinations/testResults/index?logId=${this.logId}`,
        });
      }, 500);
    },
    toCard() {
      this.submitOtherAnswer();
      this.duration = 0;
      this.$nextTick(() => {
        let isRequest = 1;
        // 收藏夹错题集的答题卡不用请求
        if (["7", "8"].includes(this.type)) {
          isRequest = 0;
        }
        uni.navigateTo({
          url: `/pages/examinations/answerSheet/index?logId=${this.logId}&model=${this.model}&isRequest=${isRequest}`,
        });
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.answer {
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  .swiper {
    flex: 1;
    &-item {
      position: relative;
      overflow-y: auto;
      box-sizing: border-box;
      padding: 20rpx 40rpx;
      &--hidden {
        overflow: hidden;
        padding: 0;
      }
    }
  }

  .bar {
    margin-top: auto;
  }
}
</style>