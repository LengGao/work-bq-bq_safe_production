<template>
  <view class="answer">
    <AnswerHead v-if="questionList[currentIndex]" :type="questionList[currentIndex].topic_type" :total="total"
                :serial-number="currentIndex + 1" />
    <swiper class="swiper" :duration="duration" @change="onSwiperChange" :current="currentIndex"
            @animationfinish="onAnimationfinish">
      <swiper-item class="swiper-item" :class="{ 'swiper-item--hidden': item.topic_type === 7 }"
                   v-for="(item, index) in questionList" :key="index">
        <template v-if="currentIndex === index || currentIndex - 1 === index || currentIndex + 1 === index">
          <Single :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 1" />
          <Multiple :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 2" />
          <Judg :model="model" :options="item" @change="onSingleChange" v-if="item.topic_type === 3" />
          <Indefinite :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 4" />
          <Completion :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 5" />
          <Short :model="model" :options="item" @change="onOtherChange" v-if="item.topic_type === 6" />
        </template>
      </swiper-item>
    </swiper>
    <!-- <AnswerBar class="bar" :model="model" :is-end="isEnd" :is-start="isStart" :time="time"
               :isCollection="!!getCurrentData.is_collection" @submit-paper="toTestResoult" 
               @next="handleNext" @prev="handlePrev" >
    </AnswerBar> -->
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

import {
  practiceStart,
  practiceAnswer,
  practiceAnalyse,
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
    Short
  },

  data() {
    return {
      lesson_id: '',
      // 当前的swiper 索引
      currentIndex: 0,
      // 案例题的swiper 索引
      caseIndex: 0,
      // swiper 动画时间
      duration: 300,
      // 考题试卷
      total: 0,
      questionList: [],
      // 答题
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
      if (!currentData) return {};
      // topic_type === 7 为案例题
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
  },
  onLoad(query) {
    // isContinue 是否为继续做题
    let { lesson_id = 60, title = "测试提" } = query
    this.lesson_id = lesson_id
    uni.setNavigationBarTitle({ title })
    this.createQuestion(lesson_id); 
  },
  onUnload() {
    if (!["7", "8"].includes(this.type)) {
      this.submitOtherAnswer().then(() => {
        this.settlement();
      });
    }
  },
  methods: {
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
    // --------------------------------- 题目选择事件
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

    // --------------------- swiper
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
    onAnimationfinish({ detail }) {
      this.submitOtherAnswer();
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
    async createQuestion(lesson_id) {
      const data = { lesson_id };
      const res = await practiceStart(data);
      console.log('res', res);
      const topic_list = res.data.topic_list;
      
      // const qusetionType = [1, 2, 3, 4, 5, 6, 7];
      // qusetionType.forEach((type) => {
        this.questionList = this.questionList.concat(topic_list[type] || []);
      // });
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