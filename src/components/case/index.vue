<template>
  <div class="case">
    <view class="quetion-content">
      <u-parse :content="options.topic_description" />
    </view>
    <view class="drawer" :class="{ 'drawer--open': isOpen }">
      <view class="btn" @click="handleToggle">
        <view class="left" :class="{ 'left--active': isOpen }"></view>
        <view class="right" :class="{ 'right--active': isOpen }"></view>
      </view>
      <view class="child-header">
        <view class="child-header-title">案例题 {{ serialNumber }}-{{ currentIndex + 1 }}
          <text class="text">（{{
              typeMap[options.child[currentIndex].topic_child_type]
            }}）</text>
        </view>
        <view class="child-header-actions">
          <view class="prev" @click="handlePrev">上一题</view>
          <view class="next" @click="handleNext">下一题</view>
        </view>
      </view>

      <swiper class="child-content swiper" @change="onSwiperChange" :current="currentIndex" duration="300"
              @animationfinish="onAnimationfinish">
        <swiper-item class="swiper-item" v-for="(item, index) in options.child" :key="index">
          <scroll-view scroll-y class="scroll-view">
            <Single :model="model" :options="item" @change="onSingleChange" v-if="item.topic_child_type === 1" />
            <Multiple :model="model" :options="item" @change="onOtherChange" v-if="item.topic_child_type === 2" />
            <Judg :model="model" :options="item" @change="onSingleChange" v-if="item.topic_child_type === 3" />
            <Indefinite :model="model" :options="item" @change="onOtherChange" v-if="item.topic_child_type === 4" />
            <Completion :model="model" :options="item" @change="onOtherChange" v-if="item.topic_child_type === 5" />
            <Short :model="model" :options="item" @change="onOtherChange" v-if="item.topic_child_type === 6" />
          </scroll-view>
        </swiper-item>
      </swiper>
    </view>
  </div>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import AnswerBar from "@/components/answerBar";
import AnswerHead from "@/components/answerHead";
import Single from "@/components/single";
import Multiple from "@/components/multiple";
import Judg from "@/components/judg";
import Indefinite from "@/components/indefinite";
import Completion from "@/components/completion";
import Short from "@/components/short";
import { submitAnswer } from "@/api/question";
export default {
  name: "case",
  components: {
    AnswerHead,
    AnswerBar,
    Single,
    Multiple,
    Judg,
    Indefinite,
    Completion,
    Short,
    uParse,
  },
  props: {
    options: {
      type: Object,
      default: () => ({
        child: [],
        topic_description: "",
      }),
    },
    current: {
      type: Number,
      default: 0,
    },
    // 当前案例题序号
    serialNumber: {
      type: [Number, String],
      default: 0,
    },
    logId: {
      type: [Number, String],
      default: "",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    model: {
      type: String,
      default: "1",
    },
    type: {
      type: String,
      default: "1",
    },
  },
  watch: {
    current(newValue) {
      this.currentIndex = newValue;
    },
    isActive(val) {
      if (!val) {
        // 失焦时提交答案
        this.submitOtherAnswer();
      }
    },
  },
  data() {
    return {
      isOpen: false,
      currentIndex: 0,
      userAnswerMap: {},
      total: 0,
      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "判断题",
        4: "不定项题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
    };
  },
  created() {
    this.total = this.options.child.length;
  },
  onUnload() {
    if (!["7", "8"].includes(this.type)) {
      this.submitOtherAnswer()
    }
  },
  methods: {
    // 提交其他题型答案
    submitOtherAnswer() {
      for (const id in this.userAnswerMap) {
        this.userAnswerMap[id] && this.submitAnswer(id, this.userAnswerMap[id]);
      }
    },
    // 收集其他题型答案
    onOtherChange(answer, id) {
      this.userAnswerMap[id] = answer;
      this.$emit("change", this.currentIndex, answer);
    },
    // 单选跟判断题答案提交
    onSingleChange(answer, id) {
      // 收藏夹不用提交答案
      if (this.type !== "7") {
        this.submitAnswer(id, [answer]);
      }
      this.$emit("change", this.currentIndex, answer);
      this.model === "2" && this.handleNext();
    },
    onSwiperChange({ detail }) {
      const { current } = detail;
      this.currentIndex = current;
      this.$emit("indexChange", current);
    },
    // 提交答案
    async submitAnswer(topic_id, answer) {
      const data = {
        log_id: this.logId,
        topic_id,
        answer,
      };
      const res = await submitAnswer(data);
      // 已提交的重置掉
      this.userAnswerMap[topic_id] && (this.userAnswerMap[topic_id] = null);
    },
    handlePrev() {
      if (this.currentIndex <= 0) {
        uni.showToast({
          icon: "none",
          title: "已经是第一小题了",
        });
        return;
      }
      this.currentIndex--;
    },
    handleNext() {
      if (this.currentIndex >= this.total - 1) {
        uni.showToast({
          icon: "none",
          title: "已经是最后一小题了",
        });
        return;
      }
      this.currentIndex++;
    },
    onSwiperBoundary() {
      if (this.currentIndex <= 0) {
        uni.showToast({
          icon: "none",
          title: "已经是第一小题了",
        });
      }
      if (this.currentIndex >= this.total - 1) {
        uni.showToast({
          icon: "none",
          title: "已经是最后一小题了",
        });
      }
    },
    onAnimationfinish({ detail }) {
      const { current } = detail;
      this.submitOtherAnswer()
      this.onSwiperBoundary();
    },
    handleToggle() {
      this.isOpen = !this.isOpen;
    },
  },
};
</script>
<style lang="scss" scoped>
.case {
  height: 100%;
  overflow: hidden;
  .quetion-content {
    height: 90%;
    overflow-y: auto;
    padding: 0 40rpx;
  }
}
.drawer {
  box-sizing: border-box;
  width: 100%;
  height: 90%;
  position: absolute;
  top: 90%;
  bottom: 0;
  left: 0;
  transition: top 0.3s;
  background-color: #fff;
  &--open {
    top: 10%;
  }
  .btn {
    text-align: center;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16rpx 0;
    background-color: #eee;
    .left,
    .right {
      width: 50rpx;
      height: 12rpx;
      background-color: #ccc;
      transition: transform 0.3s;
    }
    .left {
      border-top-left-radius: 10rpx;
      border-bottom-left-radius: 10rpx;

      &--active {
        transform: rotate(20deg);
        margin-right: -4rpx;
      }
    }
    .right {
      border-top-right-radius: 10rpx;
      border-bottom-right-radius: 10rpx;
      &--active {
        transform: rotate(-20deg);
        margin-left: -4rpx;
      }
    }
  }
  .child-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20rpx;
    border-bottom: 1px solid $uni-border-color;
    color: $uni-color-primary;
    &-title {
      font-weight: bold;
      .text {
        font-size: 24rpx;
      }
    }
    &-actions {
      display: flex;
      align-items: center;
      .prev,
      .next {
        padding: 8rpx 16rpx;
        border: 1rpx solid $uni-color-primary;
        font-size: 24rpx;
        margin-left: 10rpx;
        border-radius: 10rpx;
      }
    }
  }
  .child-content {
    box-sizing: border-box;
    height: calc(100% - 138rpx);
    padding: 10rpx 20rpx;
    .scroll-view {
      height: 100%;
    }
  }
}
</style>