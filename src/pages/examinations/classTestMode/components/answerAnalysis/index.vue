<template>
  <view class="answer-analysis">
    <view v-if="isShort">

    </view>
    <view v-else>
      <view class="title">参考答案</view>
      <view class="content">
        <view class="correct-answer">
          <view>正确答案：{{ correctAnswerText }}</view>
        </view>
        <view class="user-answer">
          <view>你的答案：{{ userAnswerText }}</view>
        </view>
      </view>
    </view>

    <view class="title">答案解析</view>
    <view>
      <u-parse :content="question.analysis || '无'" />
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
    question: {
      type: Object,
      default: () => ({})
    },
    options: {
      type: Array,
      default: () => [],
    },
    userAnswer: {
      type: [Array, String, Number],
      default: "",
    },
    correctAnswer: {
      type: [Array, String, Number],
      default: "",
    },
    desc: {
      type: [Array, String],
      default: "",
    },
    short: {
      type: Boolean,
      default: false,
    },
    type: {
      type: [String, Number],
      default: '',
    }
  },
  data() {
    return {
      userAnswerText: '',
      correctAnswerText: '',
      isShort: false
    };
  },
  mounted() {
    let userAnswer = this.question.answer, right = this.question.right, options = this.question.option, type = this.question.question_type
    console.log(type, this.question);
    if (type === 6) {
      this.isShort = true
    } else if (type === 5) {
      let { userAnswerText, correctAnswerText } = this.inputTypeParse(userAnswer, options, right)
      this.userAnswerText = userAnswerText
      this.correctAnswerText = correctAnswerText
    } else {
      let { userAnswerText, correctAnswerText } = this.selectTypeParse(userAnswer, options)
      this.userAnswerText = userAnswerText
      this.correctAnswerText = correctAnswerText
    }
    console.log(this.userAnswerText, this.correctAnswerText);
  },
  methods: {
    inputTypeParse(answer, options) {
      let correct = options.filter(item => item.is_right).map(item => item.content).join('\n')

      let str = answer.join('\n')

      return { userAnswerText: str, correctAnswerText: correct }
    },

    selectTypeParse(answer, options) {
      const selectText = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

      let correct = options.map((item, index) => {
        item.label = selectText[index]
        return item;
      }).filter(item => item.is_right).map(item => item.label).join('\n')

      let str = options.filter(item => {
        return answer.indexOf(`${item.id}`) !== -1;
      }).map(item => item.label).join('')

      return { userAnswerText: str, correctAnswerText: correct }
    }
  }
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
    flex-direction: column;
    .user-answer {
      margin-top: 60rpx;
    }
  }
}
</style>