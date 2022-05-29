<template>
  <view class="answer-sheet">
    <Header :model="model" v-if="isRequest === '1'" />
    <view class="content">
      <block v-for="(item, type) in listData" :key="type">
        <Title>{{ typeMap[type] }}</Title>
        <view class="circular-list">
          <!-- 对案例题特殊处理 -->
          <block v-if="type == 7">
            <block v-for="parent in item" :key="parent.id">
              <Circular @click="onSelect(parent.index, index)" v-for="(child, index) in parent.child" :key="child.id"
                        :type="statusMap[model][child.answer_status]">{{ parent.index }}-{{ index + 1 }}</Circular>
            </block>
          </block>
          <block v-else>
            <Circular @click="onSelect(question.index)" v-for="question in item" :key="question.id"
                      :type="statusMap[model][question.answer_status]">{{ question.index }}</Circular>
          </block>
        </view>
      </block>
    </view>
    <Footer class="footer" :model="model" @submit="handleSubmit" @click="handleClick" />
  </view>
</template>
<script>
import Title from "../components/title";
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Circular from "../components/circular";
import { getQuestionBoard } from "@/api/question";

export default {
  name: "examinationRecordSheet",
  components: {
    Header,
    Title,
    Circular,
    Footer,
  },
  data() {
    return {
      model: "1", // 1 刷题 2答题 3 答题后的解析
      listData: {},
      statusMap: {
        1: {
          "-1": "none",
          0: "error",
          1: "success",
        },
        2: {
          "-1": "none",
          0: "primary",
          1: "primary",
        },
        3: {
          "-1": "none",
          0: "error",
          1: "success",
        },
      },
      typeMap: {
        1: "单选题",
        2: "多选题",
        3: "判断题",
        4: "不定项题",
        5: "填空题",
        6: "简答题",
        7: "案例题",
      },
      isRequest: "1",
    };
  },
  computed: {
    // ...mapGetters(["questionList"]),
  },
  onLoad({ logId, model = "1", isRequest }) {
    this.model = model;
    this.isRequest = isRequest;
    if (isRequest === "1") {
      this.getQuestionBoard(logId);
    } else {
      // this.listData = this.questionList;
    }
  },
  methods: {
    onSelect(number, caseIndex) {
      const pages = getCurrentPages(); //获取所有页面栈实例列表
      const prevPage = pages[pages.length - 2]; //上一页页面实例
      const vm = prevPage.$vm;
      // 把选中的赋值
      vm.currentIndex = number - 1;
      caseIndex && (vm.caseIndex = caseIndex);
      vm.duration = 300;
      this.goBack();
    },
    handleSubmit() {
      uni.showModal({
        title: '提示',
        content: '您还有题未作答，确认交卷吗？',
        success: ({ confirm }) => {
          if (confirm) {
            const pages = getCurrentPages(); //获取所有页面栈实例列表
            const prevPage = pages[pages.length - 2]; //上一页页面实例
            const vm = prevPage.$vm;
            this.goBack();
            vm.toTestResoult();
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
    async getQuestionBoard(log_id) {
      const data = { log_id };
      const res = await getQuestionBoard(data);
      this.listData = res.data;
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
      flex-wrap: wrap;
    }
  }
  .footer {
    flex-shrink: 0;
    margin-top: auto;
  }
}
</style>