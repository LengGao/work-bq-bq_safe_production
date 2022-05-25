<template>
  <view class="answer-analysis">
    <view class="title" v-if="!short">参考答案</view>
    <view class="content" v-if="!short">
      <view>
        <view>正确答案：{{ correctAnswer }}</view>
      </view>
      <view class="user-answer" v-if="userAnswer">
        <view>你的答案:{{ userAnswer }}</view>
      </view>
    </view>
    <view class="title">答案解析</view>
    <view>
      <u-parse :content="desc || '无'" />
    </view>
  </view>
</template>
<script>
import uParse from "@/components/gaoyia-parse/parse.vue";

export default {
  name: "circular", // 章节练习的答案解析
  components: {
    uParse,
  },
  props: {
    userAnswer: {
      type: String,
      default: "",
    },
    correctAnswer: {
      type: String,
      default: "",
    },
    desc: {
      type: String,
      default: "",
    },
    short: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
};
</script>
<style lang="scss" scoped>
.answer-analysis {
  .title {
    color: $uni-color-primary;
    font-weight: bold;
    margin-top: 60rpx;
    margin-bottom: 12rpx;
  }
  .content {
    display: flex;
    align-items: center;
    .user-answer {
      margin-left: 60rpx;
    }
  }
}
</style>