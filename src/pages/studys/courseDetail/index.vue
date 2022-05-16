<template>
  <view class="course-detail">
    <video :src="video" :autoplay="true" class="course-video"></video>

    <view class="segmented-bar">
      <uni-segmented-control :current="current" :values="items" @clickItem="onChangeSegmented" styleType="text"
                             activeColor="#199ff" />
      <view class="segmented-content">
        <view v-show="current === 0" class="segmented-pane">
          <Details :info="info" :content="content" />
        </view>
        <view v-show="current === 1" class="segmented-pane">
          <Catalogue v-if="course_id" :courseId="course_id" />
        </view>
        <view v-show="current === 2" class="segmented-pane">
          <Rate ref="rate" :courseId="course_id" @openComment="onComment" />
        </view>
      </view>
    </view>

    <view class="footer">
      <button class="footer-btn">开始学习</button>
    </view>

    <uni-popup ref="popup" type="center" class="popup">
      <div class="dialog">
        <view class="dialog-title"> 我的评价</view>
        <view class="dialog-content">
          <view class="rate">
            <uni-rate :value="rateForm.star" @change="onChangeRate" :size="42" :touchable="false" />
            <view class="rate-content">{{ starText[rateForm.star] }}</view>
          </view>
          <view class="tags">
            <view v-for="(tag, index) in commentHotWord" :key="index" class="tags-btn" :class="tag.checked ? 'btn-active' : ''"
                  @click="() => onTagSelect(index)">{{ tag.label }}</view>
          </view>
        </view>
        <view class="dialog-footer">
          <view class="remark">
            <input v-model="rateForm.comment" placeholder="说一说听课的感受和建议吧·" class="remark-input" />
          </view>
          <button class="dialog-footer-btn" plain @click="onPublish">发表评论</button>
        </view>
      </div>
    </uni-popup>

  </view>
</template>

<script>
import Details from './components/Details'
import Catalogue from "./components/Catalogue"
import Rate from './components/Rate'
import { mapGetters } from 'vuex'
import { 
  courseInfo,
  courseCommentSubmit
} from '@/api/course'

export default {
  components: {
    Details,
    Catalogue,
    Rate,
  },
  data() {
    return {
      show: false,
      region_id: 1,
      course_id: 26,
      up: { page: { num: 0, size: 10, time: 1000 } },
      // 课程详情
      courseInfo: {},
      content: '',
      info: {},
      // 目录
      chapterList: [],
      // 评价
      courseGetComment: [],
      
      tags: [],
      starText: ['', '不满意', '一般', '比较满意', '满意', '非常满意'],
      rateForm: {
        star: 0,
        hot_word: [],
        comment: '',
      },
      current: 0,
      items: ['简介', '目录', '评价'],
      video: "https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4"
    }
  },
  computed: {
    ...mapGetters(['commentHotWord'])
  },
  onLoad(query) {
    console.log('query', query);
    this.getCourseInfo()
  },
  methods: {
    // 分段其切换
    onChangeSegmented({ currentIndex }) {
      this.current = currentIndex
    },
    // 打分
    onChangeRate(e) {
      console.log('onChangeRate', e);
      this.rateForm.star = e.value
    },
    // 评价
    onComment() {
      this.$refs.popup.open()
    },
    // 关闭
    onClose() {
      this.$refs.popup.close()
    },
    // 标签
    onTagSelect(index) {
      this.commentHotWord[index].checked = !this.commentHotWord[index].checked
    },
    // 获取标签
    getTag(tags) {
      return tags.filter(filterItem => filterItem.checked).map(mapItem => mapItem.label)
    },
    // 发表评论
    async onPublish() {
      let {star, comment} = this.rateForm

      let params = {
        course_id: this.course_id,
        star: star,
        hot_word: this.getTag(this.commentHotWord),
        comment: comment
      }
            
      let res = await courseCommentSubmit(params)
      if (res.code === 0) {
        uni.showToast({ icon: 'success', title: '评论失败' })
        this.$refs.rate.downCallback()
      } else {
        uni.showToast({ icon: 'error', title: '评论失败' })
      }
    },
    // 复制课程信息
    copy() {
      let obj = {}, data = this.courseInfo
      Object.keys(data).forEach(k => {
        if (k !== 'content') { obj[k] = data[k]; }
      })
      this.info = obj
      this.content = data.content 
    },
    // 课程简介
    async getCourseInfo() {
      let param = { region_id: this.region_id, course_id: this.course_id }
      let res = await courseInfo(param)
      this.courseInfo = res.data
      this.copy()
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.course-detail {
  padding-bottom: 100rpx;
}

.course-video {
  width: 100%;
  height: 30vh;
}

::v-deep .segmented-control {
  height: 72rpx;
}

.segmented-pane {
  border-top: $logan-border-spacing-md;
}

::v-deep .segmented-control__text {
  font-size: $font-size-base;
  line-height: calc(2 * $font-size-base);
}

.footer {
  position: fixed;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);

  left: 0;
  width: 100%;

  &-btn {
    width: 80%;
    font-size: $font-size-md;
    color: #fff;
    border-radius: 64rpx;
    background-color: #199fff;
  }
}

.popup {
  background-color: $bg-color-mask;
}

.dialog {
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 60rpx 0;
  width: 600rpx;
  height: 800rpx;
  overflow: hidden;
  font-size: $font-size-base;
  color: $text-color-grey;
  background-color: #fff;

  &-title {
    width: 100%;
    text-align: center;
    font-size: $font-size-xlg;
    font-weight: 600;
    color: #199fff;
  }

  &-content {
    flex: 2 1 0;
    display: flex;
    flex-direction: column;

    .rate {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 20rpx;

      &-content {
        margin-top: 20rpx;
        font-size: $font-size-sm;
      }
    }

    .tags {
      display: flex;
      flex-direction: row;
      justify-content: space-evenly;
      align-items: baseline;
      flex-wrap: wrap;
      margin-top: 40rpx;
      padding: 0 60rpx;
      

      &-btn {
        margin: 10rpx;
        padding: 12rpx;
        color: #777;
        font-size: 24rpx;
        text-align: center;
        border: 2rpx solid rgb(236, 236, 236);
        border-radius: 12rpx;
      }

      .btn-active {
        color: #199fff;
        border-color: #199fff;
      }
    }
  }

  &-footer {
    .remark {
      margin: 30rpx 40rpx 30rpx 82rpx;
      width: 80%;
      height: 54rpx;
      line-height: 54rpx;
      border-bottom: $logan-border-spacing-md-sm;

      &-input {
        font-size: $font-size-base;
        color: $text-color;
      }
    }

    .dialog-footer-btn {
      width: 70%;
      font-size: $font-size-base;
      color: #199fff;
      border-color: #199fff;
      border-radius: 24rpx;
    }
  }
}
</style>