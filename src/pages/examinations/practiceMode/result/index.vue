<template>
  <view class="answer-sheet">
    <Header :model="model" />
    <view class="content">
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
    <Footer class="footer" :model="model" @submit="handleSubmit" @click="handleClick" />
  </view>
</template>

<script>
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Title from "../components/title/index";
import Circular from "../components/circular/index";
import { getPracticeAnswerSheet } from "@/api/question";

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
  onLoad({ chapter_id, question_bank_id }) {
    this.chapter_id = chapter_id
    this.question_bank_id = question_bank_id
    this.getQuestionBoard();
  },
  methods: {
    onSelect(type, index) {
      let types = this.listData[type]
      let question_id = types[index].id
      console.log(type, index, types);
      let chapter_id = this.chapter_id
      let question_bank_id = this.question_bank_id
      let url = `/pages/examinations/practiceMode/answer/index`
      let query = `?chapterId=${chapter_id}&question_bank_id=${question_bank_id}&question_id=${question_id}&isReview=1`
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
      const res = await getPracticeAnswerSheet(data);
      this.listData = res.data.list;
    },
  },
};
</script>
<style lang="scss" scoped>
.answer-sheet {
  height: 100%;
  display: flex;
  flex-direction: column;
  .content {
    padding: 20rpx 40rpx;
    flex: 1;
    overflow-y: auto;
    .circular-list {
      display: flex;
      flex-flow: row wrap;
    }
  }
  .footer {
    flex-shrink: 0;
    margin-top: auto;
  }
}
</style>