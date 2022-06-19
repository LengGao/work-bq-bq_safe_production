<template>
  <view class="answer-sheet">
    <custom-header :title="defaultTitle"></custom-header>
    
    <Header v-if="source !== 'favorites' &&  source !== 'wrong'" :model="model" />
    <view class="content">
      <view v-for="(item, type) in list" :key="type">
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

    <Footer class="footer" :noFinish="noFinish" :model="model" @submit="handleSubmit" @click="handleClick" />
  </view>
</template>

<script>
import Header from "../components/header/index";
import Footer from "../components/footer/index";
import Title from "../components/title/index";
import Circular from "../components/circular/index";
import CustomHeader from "@/components/custom-header"
import { browser } from '@/mixins/index'
import { 
  wrongAnswerSheet,
  collectAnswerSheet,
  getPracticeAnswerSheet,
  getExamAnswerSheet, 
  submitExamPaper
} from "@/api/question";

export default {
  name: "answerSheet",
  mixins: [browser],
  components: {
    Title,
    Header,
    Footer,
    Circular,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '答题卡',
      chapter_id: 0, 
      exam_log_id: 0,
      question_id: 0,
      question_bank_id: 0,
      source: '',
      model: '',
      title: '',

      noFinish: false,

      list: {},
      arr: [],
      answerSheetApiMap: {},
      typesNumber: {},
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
  onLoad(query) {
    this.init(query)
    this.injectApi()
    this.getQuestionBoard();
  },
  methods: {
    init(query) {
      let {
        chapter_id, 
        exam_log_id,
        question_id,
        question_bank_id,
        source,
        model,
        title
      } = query
      this.chapter_id = +chapter_id
      this.exam_log_id = +exam_log_id
      this.question_id = +question_id
      this.question_bank_id = +question_bank_id
      this.source = source
      this.model = +model
      this.title = title
    },

    injectApi() {
      this.answerSheetApiMap = {
        "wrong": wrongAnswerSheet,
        "favorites": collectAnswerSheet,
        "chapter": getPracticeAnswerSheet,
        "examRandom": getExamAnswerSheet,
        "examAutonomy": getExamAnswerSheet,
        "examRecord": getExamAnswerSheet,
        "memoryWrong": wrongAnswerSheet,
        "memoryFavorites": collectAnswerSheet,
      }
    },

    getPath(url, query) {
      let params = ''
      Object.keys(query).forEach((key) => { params += `&${key}=${query[key]}` })
      params = params.replace(/&?/, '?')
      return url + params
    },

    getQuery() {
      return {
        exam_log_id: this.exam_log_id,
        chapter_id: this.chapter_id,
        question_id: this.question_id,
        question_bank_id: this.question_bank_id,
        model: this.model,
        source:  this.source,
        title: this.title,
      }
    },

    goBack() {
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack()
      } else {
        history.back()
      }
    },

    getQuestionId(type, index) {
      console.log(this.list[type], index);
      return this.list[type][index].id || this.list[type][index]
    },

    onSelect(type, index) {
      
      let url = `/pages/examinations/answer/index`
      let question_id = this.getQuestionId(type, index)
      let {exam_log_id, chapter_id, question_bank_id,  model, source, title} = this.getQuery()
      let query = { exam_log_id, chapter_id, last_question_id: question_id, question_bank_id,  model, source, title }
      let path = this.getPath(url, query)
      console.log('query',query);
      uni.redirectTo({ url: path })
    },

    handleSubmit() {
      let empty = this.arr.some(item => item.is_answered === 0)
      uni.showModal({
        title: "提示", 
        content: empty ? '您还有题未作答，确认交卷吗？' : '您确认要交卷吗？',
        success: (res) => { if (res.confirm) { this.submitExamPaper() }}
      })
    },

    handleClick() {
      let url = `/pages/examinations/answer/index`
      let {exam_log_id, chapter_id, question_id, question_bank_id,  model, source, title} = this.getQuery()
      let query = {exam_log_id, chapter_id, last_question_id: question_id, question_bank_id,  model, source, title}
      let path = this.getPath(url, query)

      if (this.noFinish) {
        uni.redirectTo({ url: path })
      } else { 
        this.goBack()
      }
    },

    async submitExamPaper() {
      let url = `/pages/examinations/answerResult/index`
      let {exam_log_id, chapter_id, question_id, question_bank_id, model, source, title} = this.getQuery()
      let query = { exam_log_id, chapter_id, question_bank_id, model, source, title}
      let path = this.getPath(url, query)
      let params = { exam_log_id, question_bank_id }
      let res = await submitExamPaper(params)
      if (res.code === 0) {
        uni.showToast({ title: '提交成功' , icon: 'success' })
        uni.redirectTo({ url: path })
      }
    },

    async getQuestionBoard() {
      let params = {
        chapter_id: this.chapter_id, 
        exam_log_id: this.exam_log_id,
        question_bank_id: this.question_bank_id, 
      }
      
      let api = this.answerSheetApiMap[this.source] 
      let res = await api(params)
      if (res.code === 0) {
        this.arr = res.data.arr
        this.list = res.data.list;
        this.checkIsFinish(this.arr)
      }
    },
    
    statisticsQuestions(list) {
      let obj = {}
      Object.keys(list).forEach(k => {
        obj[k] = list[k]?.length
      })
      this.typesNumber = obj
    },

    checkIsFinish(arr) {
      this.noFinish = arr.some(item => {
        if (item.child) {
          return item.child.some(c => c.is_answered === 0)
        } else {
          return item.is_answered === 0
        }
      })
    }
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