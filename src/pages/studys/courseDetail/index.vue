<template>
  <view class="course-detail">
    <!-- <video :src="video" :autoplay="false" class="course-video" @play="onPlay">
      <cover-view class="course-cover" :style="isPlay ? 'display: none' : ''">
        <cover-image :src="info.cover"></cover-image>
      </cover-view>
    </video> -->
    <!-- # ifdef H5 -->
    <div id="aliplayer"></div>
    <!-- # endif -->

    <!-- 分段器 -->
    <view class="segmented-bar">
      <uni-segmented-control :current="current" :values="items" @clickItem="onChangeSegmented" styleType="text"
                             activeColor="#199ff" />
      <view class="segmented-content">
        <view v-show="current === 0" class="segmented-pane">
          <Details v-if="courseInfo.teacher" :data="courseInfo" :courseId="course_id" @start="onStart" />
        </view>
        <view v-show="current === 1" class="segmented-pane">
          <Catalogue v-if="course_id" :courseId="course_id" :learningLessonId="learning_lesson_id"
                     @videoChange="onChangeVideo" />
        </view>
        <view v-show="current === 2" class="segmented-pane">
          <Rate ref="rate" :courseId="course_id" @openComment="onComment" />
        </view>
      </view>
    </view>

    <uni-popup ref="popup" type="center" class="popup">
      <div class="dialog">
        <view class="dialog-title"> 我的评价</view>
        <view class="dialog-content">
          <view class="rate">
            <uni-rate :value="rateForm.star" @change="onChangeRate" :size="42" />
            <view class="rate-content">{{ starText[rateForm.star] }}</view>
          </view>
          <view class="tags">
            <view v-for="(tag, index) in tags" :key="index" class="tags-btn" :class="tag.checked ? 'btn-active' : ''"
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
      <view class="close">
        <uni-icons type="close" color="#fff" size="42" @click="onClose" />
      </view>
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
  courseCommentSubmit,
  courseGetVideoAuth,
  courseRecordLearn
} from '@/api/course'

export default {
  components: {
    Details,
    Catalogue,
    Rate,
  },
  data() {
    return {
      region_id: 1,
      course_id: 26,
      learning_lesson_id: 38,
      isPlay: false,

      // 上拉配置
      up: { page: { num: 0, size: 10, time: 1000 } },
      // 课程详情
      courseInfo: {},
      // 目录
      chapterList: [],
      // 评价
      tags: [],
      courseGetComment: [],
      // 评价
      starText: ['', '不满意', '一般', '比较满意', '满意', '非常满意'],
      rateForm: {
        star: 0,
        comment: '',
      },
      // 分段其
      current: 0,
      items: ['简介', '目录', '评价'],

      // h5 视频
      title: '',
      cover: '',
      is_free: false,
      start_second: 0,
      free_second: 0,
      is_forward: false, 
      prevTime: 0, // 记录上次时间
      player: null,
      time: 1000 * 10,
      intervalId: null,
    }
  },
  computed: {
    ...mapGetters(['commentHotWord'])
  },
  watch: {
    commentHotWord(val) {
      this.tags = val
    }
  },
  onLoad(query) {
    console.log('query', query);
    this.getCourseInfo()
  },
  mounted() {
    this.getCourseGetVideoAuth({ lesson_id: this.learning_lesson_id })
  },
  destroyed() {
    this.player && this.player.dispose();
    this.intervalId = null
  },
  methods: {
    // ------------------- 视频相关 --------------------------
    // 更换播放视频
    onChangeVideo(detailArr) {
      let curr = detailArr[0]
      let params = { lesson_id: curr.id }
      this.getCourseGetVideoAuth(params)
    },
    // 开始学习
    onStart() {

    },
    onPlay() {
      this.isPlay = true
    },
    //定时发送数据
    intervalSend() {
      // 定时器开始前先请空，再开启
      if (this.intervalId) { clearInterval(this.intervalId) }
      this.intervalId = setInterval(() => { this.sendData() }, this.time)  
    },
    // 暂停发送
    stopSend() {
      if (!this.intervalId) {
        // 清空定时发送时间，发送暂停时的播放时间
        clearInterval(this.intervalId)
        this.intervalId = null
        this.sendData()
      }
    },
    // 发送数据
    async sendData() {
      // 由已经播放的时间减去开始播放的时间，判断是否拖动了进度条，
      let endTime = this.player.getCurrentTime(), startTime = this.start_second
      const isSend = (Math.abs(endTime - startTime) <= 1.5) && startTime != endTime
      
      if (isSend) {
        let params = {
          lesson_id: this.learning_lesson_id,
          start_second: parseFloat(this.prevTime),
          end_second: parseFloat(endTime)
        }

        let res = await courseRecordLearn(params)
        if (res.code === 0) {
          let last_second = res.data.last_second
          let redirect_url = res.data.redirect_url
          if (redirect_url) location.href = redirect_url // 需要人脸识别
        }
      }
      this.prevTime = endTime
      this.startTime = endTime // 统一时间
    },
    // 创建播放器
    createPlayer(options) {
      //有的话就先销毁
      this.player && this.player.dispose();
      this.player = new Aliplayer({
        id: 'aliplayer',
        width: '100%',
        height: '200px',
        autoplay: true,
        isLive: false,
        playsinline: true,
        preload: true,
        useH5Prism: true,
        x5_type: "H5",
        skinLayout: [
          { name: "bigPlayButton", align: "blabs", x: 30, y: 80 },
          { name: "H5Loading", align: "cc" },
          { name: "errorDisplay", align: "tlabs", x: 0, y: 0 },
          { name: "infoDisplay" },
          { name: "tooltip", align: "blabs", x: 0, y: 56 },
          { name: "thumbnail" },
          {
            name: "controlBar", align: "blabs", x: 0, y: 0,
            children: [
              { name: "progress", align: "blabs", x: 0, y: 44 },
              { name: "playButton", align: "tl", x: 15, y: 12 },
              { name: "timeDisplay", align: "tl", x: 10, y: 7 },
              { name: "fullScreenButton", align: "tr", x: 10, y: 12 },
              { name: "subtitle", align: "tr", x: 15, y: 12 },
              { name: "volume", align: "tr", x: 5, y: 10 }
            ]
          }
        ],
        //播放方式二：点播用户推荐
        vid: options.video_id,
        playauth: options.auth_data.PlayAuth,
        cover: options.cover,
        encryptType: 0, // 当播放私有加密流时需要设置。
      }, (player) => {     
        // 监听播放
        player.on('play', () =>{
          player.seek(this.start_second)
          this.intervalSend()
        })
        // 监听暂停
        player.on('pause', () => {
          this.stopSend()
        })
        // 监听结束
        player.on('ended', () =>{
          this.is_free = true
          this.start_second = 0
          player.seek(0)
        })
        /**
         * 是否允许快进
         * 1，本省可快进的
         * 2，学完以后可快进
         */
        player.on('timeupdate', () => {
          let emdTime = player.getCurrentTime()
          if (this.is_forward) {
            this.start_second = emdTime
            player.seek(this.start_second)
          } else if (this.is_free) {
            this.start_second = emdTime
            player.seek(this.start_second)
          } else {
            if (Math.abs(emdTime - this.start_second) >= 2) {
              player.seek(this.start_second)
            } else {
              this.start_second = emdTime
            }
          }
        })
      })
      //  $(".prism-setting-quality").remove();
      //   $(".prism-setting-audio").remove();
      //   $(".prism-cc-btn").remove()
      //  !options.playAuth && $('.prism-big-play-btn').remove()


      this.player.play()
    },
    // 获取视频凭证
    async getCourseGetVideoAuth(params) {
      let res = await courseGetVideoAuth(params)
      if (res.code === 0) {
        let { video_id, auth_data, start_second, lesson_id, title, cover, is_free,
              free_second, is_forward, 
            } = res.data
        this.title = title
        this.is_free = is_free
        this.free_second = free_second
        this.is_forward = is_forward
        this.start_second = start_second
        this.learning_lesson_id = lesson_id
        this.prevTime = start_second
        this.createPlayer({ video_id, auth_data, start_second, cover, is_free })
      }
    },
    // ----------------------------------------------

    // 分段其切换
    onChangeSegmented({ currentIndex }) {
      this.current = currentIndex
    },
    // 我要评价
    onComment() {
      this.resetForm()
      this.$refs.popup.open()
    },
    // 关闭评论
    onClose() {
      this.$refs.popup.close()
    },
    // 重置评论表单
    resetForm() {
      this.rateForm = { star: 0, comment: '' }
      this.tags = this.tags.map(item => {
        item.checked = false;
        return item
      })
    },
    // 评论热刺选择
    onTagSelect(index) {
      this.tags[index].checked = !this.tags[index].checked
    },
    // 评论打分
    onChangeRate(e) {
      this.rateForm.star = e.value
    },
    // 获取评论热词
    getTag(tags) {
      return tags.filter(filterItem => filterItem.checked).map(mapItem => mapItem.label)
    },
    // 发表评论
    async onPublish() {
      let { star, comment } = this.rateForm

      let params = {
        course_id: this.course_id,
        star: star,
        hot_word: this.getTag(this.tags),
        comment: comment
      }

      let res = await courseCommentSubmit(params)
      if (res.code === 0) {
        uni.showToast({ icon: 'success', title: '评论失败' })
        this.$refs.rate.downCallback()
        this.$refs.rate.getCourseCommentCount()
        this.onClose()
      }
    },
    // 课程简介
    async getCourseInfo() {
      let param = { region_id: this.region_id, course_id: this.course_id }
      let res = await courseInfo(param)
      if (res.code === 0) {
        this.courseInfo = res.data
      }
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

  &-cover {
    width: 100%;
    height: 100%;
  }
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

.popup {
  background-color: $bg-color-mask;

  .close {
    margin-top: 30rpx;
    width: 100%;
    text-align: center;
  }
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
        color: #aaa;
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