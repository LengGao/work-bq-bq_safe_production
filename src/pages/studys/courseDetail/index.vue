<template>
  <view class="course-detail">
    <!-- #ifdef H5 -->
    <view id="aliplayer">
    <img v-if="!player" :src="courseInfo.cover" mode="aspectFit" class="course-cover" />
    </view>
    <!-- #endif -->
    <!-- #ifdef MP-WEIXIN -->
    <video v-if="src" class="course-video" id="course-video" :src="src" :autoplay="false" :initial-time="start_second"
           :title="title" :poster="cover" :poster-for-crawler="cover" @play="onPlay" @pause="onPause" @ended="onEnded"
           @timeupdate="onTimeupdate" @loadedmetadata="onLoadedmetadata" @error="onError">
    </video>
    <!-- #endif -->

    <!-- 分段器 -->
    <view class="segmented-bar">
      <uni-segmented-control :current="current" :values="items" @clickItem="onChangeSegmented" styleType="text"
                             activeColor="#199fff" />
      <view class="segmented-content">
        <view v-show="current === 0" class="segmented-pane">
          <Details v-if="courseInfo.teacher" :info="courseInfo" :courseId="course_id" />
        </view>
        <view v-show="current === 1" class="segmented-pane">
          <Catalogue v-if="course_id && lesson_id" :courseId="course_id" :lessonId="lesson_id"
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
  courseRecordLearn,
  courseCommentHotWord,
} from '@/api/course'

export default {
  components: {
    Details,
    Catalogue,
    Rate,
  },
  data() {
    return {
      region_id: 0,
      course_id: 0,
      lesson_id: 0,

      // 上拉配置
      up: { page: { num: 0, size: 10, time: 1000 } },
      // 课程详情
      courseInfo: {},
      // 目录
      chapterList: [],
      // 评价
      tags: [],
      // 评价
      starText: ['', '不满意', '一般', '比较满意', '满意', '非常满意'],
      rateForm: {
        star: 1,
        comment: '',
      },
      // 分段器材
      current: 0,
      items: ['简介', '目录', '评价'],

      // h5 视频 小程序视频
      src: '',
      title: '',
      cover: '',
      prev_time: 0, // 记录上次时间
      start_second: 0,
      end_time: 0,
      free_second: 0,
      duration: 0,
      time: 1000 * 10,
      intervalId: null,
      is_free: false,   // 是否播完
      is_forward: false,
      player: null,
      disableChange: false,
    }
  },
  computed: {
  
  },
  watch: {

  },
  onLoad(query) {
    let { course_id } = query
    this.course_id = course_id
    this.region_id = this.$store.getters.region.id
    this.getCourseInfo()
    this.getCommentHotWord()
  },
  mounted() {
    let _this = this
    document.addEventListener('visibilitychange', function (state) {
      _this.pausePlay()
    })
  },
  onUnload() {
    console.log('onUnload(');
    clearInterval(this.intervalId)
    this.intervalId = null
    /* #ifdef H5 */
    if (this.player) this.player.dispose();
    /* #endif */
  },
  methods: {
    // 加载完成
    onLoadedmetadata() {
      wx.createSelectorQuery().select('#course-video').context((res) => {
        this.player = res.context;
        this.player.play()
      }).exec()
    },
    // 播放
    onPlay() {
      this.intervalSendMini()
    },
    // 展厅
    onPause(e) {
      this.stopSendMini()
    },
    // 结束
    onEnded(e) {
      this.stopSendMini()
      this.is_free = true
      this.prev_time = 0
      this.start_second = 0
      this.end_time = 0
      this.player.seek(0)
      this.showModal()
    },
    // 进度更新
    onTimeupdate({ detail }) {
      let currentTime = detail.currentTime
      if (this.is_forward || this.is_free) {
        this.end_time = currentTime
      } else {
        if (Math.abs(currentTime - this.start_second) >= 2) {
          this.player.seek(this.start_second)
        } else {
          this.start_second = currentTime
          this.end_time = currentTime
        }
      }
    },
    onEnded(err) {
      console.log('onEnded', err);
    },
    //定时发送数据
    intervalSendMini() {
      // 定时器开始前先请空，再开启
      if (this.intervalId) { clearInterval(this.intervalId) }
      this.intervalId = setInterval(() => { this.sendDataMini() }, this.time)
    },
    // 暂停发送
    stopSendMini() {
      if (this.intervalId) {
        // 清空定时发送时间，发送暂停时的播放时间
        clearInterval(this.intervalId)
        this.intervalId = null
        this.sendDataMini()
      }
    },
    // 发送数据
    async sendDataMini() {
      // 由已经播放的时间减去开始播放的时间，判断是否拖动了进度条，
      let endTime = this.end_time

      let params = {
        lesson_id: this.lesson_id,
        start_second: parseFloat(this.prev_time),
        end_second: parseFloat(endTime)
      }

      let res = await courseRecordLearn(params)
      if (res.code === 0) {
        let last_second = res.data.last_second
        let redirect_url = res.data.redirect_url
        if (redirect_url) {
          this.player.pause()
          this.onPause()
          uni.showToast({ icon: 'none', title: `${res.message}` })
          setTimeout(() => {
            this.soterAuthentication(redirect_url)
          }, 1000)
        }
      } else {
        this.player.pause()
        this.onPause()
        uni.showToast({ icon: 'icon', title: `${res.message}` })
      }

      this.prev_time = endTime
    },
    // 设置播放器
    settingPlayer(options) {
      this.src = 'https://img.cdn.aliyun.dcloud.net.cn/guide/uniapp/%E7%AC%AC1%E8%AE%B2%EF%BC%88uni-app%E4%BA%A7%E5%93%81%E4%BB%8B%E7%BB%8D%EF%BC%89-%20DCloud%E5%AE%98%E6%96%B9%E8%A7%86%E9%A2%91%E6%95%99%E7%A8%8B@20200317.mp4'
    },
    // 生物认证
    async soterAuthentication(redirect_url) {
      let check = await wx.checkIsSupportSoterAuthentication()
      console.log('check', check);
      if (check.supportMode.indexOf('facial') !== -1) {
        wx.startSoterAuthentication({
          requestAuthModes: ['facial'],
          authContent: '身份验证'
        })
      }
    },

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

    // 发表评论
    async onPublish() {
      let { star, comment } = this.rateForm
      let hot_word = this.tags.filter(filterItem => filterItem.checked).map(mapItem => mapItem.label)
      let params = {
        course_id: this.course_id,
        star: star,
        hot_word: hot_word,
        comment: comment
      }

      let res = await courseCommentSubmit(params)
      if (res.code === 0) {
        uni.showToast({ icon: 'success', title: '评论陈功' })
        this.$refs['rate'].downCallback()
        this.$refs['rate'].getCourseCommentCount()
        this.onClose()
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none'})
      }
    },
    // 课程简介
    async getCourseInfo() {
      let param = { region_id: this.region_id, course_id: this.course_id }
      let res = await courseInfo(param)
      if (res.code === 0) {
        this.lesson_id = res.data.learning_lesson_id
        this.courseInfo = res.data
        this.videoCover = res.data.cover
        this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: res.data.learning_lesson_id })
      }
    },

    async getCommentHotWord() {
      let res = await courseCommentHotWord()
      if (res.code === 0) {
        let list = res.data.map((word, index) => ({ id: index, label: word, checked: false }))
        this.tags = list
      }
    },

    // 更换播放视频
    onChangeVideo(detailArr) {
      let curr = detailArr[0]
      let params = { region_id: this.region_id, lesson_id: curr.id }
      this.lesson_id = curr.id
      this.getCourseGetVideoAuth(params)
    },

    // 随堂测试
    showModal() {
      let url = `/pages/examinations/classTestMode/answer/index`,
        query = `?lesson_id=${this.lesson_id}`
      if (this.free_second && Math.abs(this.free_second, this.start_second) <= 2) {
        this.is_free = false
        uni.showToast({ title: `试看结束，请购买该课程`, icon: 'none'})
      } else {
        this.is_free = true
        uni.showModal({
          title: '提示',
          content: '本次学习需要进行随堂考试,测评合格后(≥80分)将计入相应学时',
          showCancel: true,
          cancelText: '取消',
          confirmText: '开始考试',
          cancelColor: '#199fff',
          confirmColor: '#199fff',
          success: (res) => {
            if (res.confirm) {
              this.$store.commit('SET_EXAMINATION', true)
              uni.navigateTo({ url: url + query })
            }
          }
        })
      }      
    },

    //定时发送数据
    intervalSend() {
      // 定时器开始前先请空，再开启
      if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }

      this.intervalId = setInterval(() => {
        let start_second = this.start_second
        let end_time = this.player.getCurrentTime()
        let lesson_id = this.lesson_id
        this.sendData(lesson_id, start_second, end_time)
      }, this.time)
    },
    stopSend() {
      clearInterval(this.intervalId)
      this.intervalId = null
      this.getRecond()
    },
    pausePlay() {
      this.player.pause()
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    resetProgress() {
      this.start_second = 0
      this.prev_time = 0
      this.end_time = 0
      this.intervalId = null
    },
    endedCallback() {
      this.stopSend()
      this.showModal()
      this.resetProgress()
    },
    getRecond() {
      let start_second = this.start_second
      let end_time = this.player.getCurrentTime()
      let lesson_id = this.lesson_id
      this.sendData(lesson_id, start_second, end_time)
    },

    // 创建播放器
    createPlayer(options) {
      if (this.player) this.player.dispose();

      this.player = new Aliplayer({
        id: 'aliplayer',
        width: '100%',
        height: '200px',
        controlBarVisibility: 'click',
        autoplay: false,
        isLive: false,
        playsinline: true,
        preload: true,
        useH5Prism: true,
        x5_type: "H5",
        skinLayout: [
          { name: "bigPlayButton", align: "blabs", x: 30, y: 80 },
          { name: "H5Loading", align: "cc", },
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
              { name: "volume", align: "tr", x: 5, y: 10 }
            ]
          }
        ],
        vid: options.video_id,
        playauth: options.auth_data.PlayAuth,
        cover: options.cover,
        duration: options.duration,
        encryptType: 0
      }, (player) => {
        player.on('ready', () => {
          player.setPreviewTime(options.free_second)
          player.seek(this.start_second)
          player.play()
        })
        player.on('play', () => {
          this.intervalSend()
        })
        player.on('pause', () => {
          console.log('pause');
          this.stopSend()
        })
        player.on('ended', (e) => {
          console.log("ended", e);
          this.endedCallback()
          this.player.seek(0)
        })
        player.on('timeupdate', () => {
          let currTime = player.getCurrentTime()
          if (this.is_forward || this.is_free) {
            this.start_second = currTime
          } else {
            if (Math.abs(currTime - this.start_second) >= 2) {
              player.seek(this.start_second)
            } else {
              this.start_second = currTime
            }
          }
        })
        player.on('error', () => {
          this.pausePlay()
        })
      })
    },
    // 发送数据
    async sendData(lesson_id, start_second, end_second) {
      let params = { lesson_id, start_second, end_second }
      let res = await courseRecordLearn(params)
      if (res.code === 0) {

        let redirect_url = res.data.redirect_url
        if (redirect_url) {
          location.href = redirect_url
        }
      } else if (res.code === 2201) {
        // 有章节没看完
        this.pausePlay()
        uni.showToast({ title: `${res.message}`, icon: 'none', duration: 2000 })
      } else {
        this.pausePlay()
        uni.showToast({ icon: 'none', title: `${res.message}` })
      }

      this.prev_time = end_second
    },

    // 获取视频凭证
    async getCourseGetVideoAuth(params) {
      let res = await courseGetVideoAuth(params)
      let code = res.code
      let { video_id, auth_data, start_second, duration, lesson_id, title, cover,
        free_second, is_forward, is_free} = res.data

      if (code === 0) {
        this.title = title
        this.cover = cover
        this.is_free = is_free
        this.is_forward = is_forward
        this.free_second = free_second
        this.start_second = start_second
        this.prev_time = start_second
        this.duration = duration
        /* #ifdef H5 */
        this.createPlayer({ video_id, auth_data, start_second: 0, cover, free_second, duration })
        /* #endif */
        /* #ifdef MP-WEIXIN */
        this.settingPlayer({ video_id, auth_data, start_second, cover, free_second, duration })
        /* #endif */
      } else if (code === 2001) {
        // 没购买
        this.pausePlay()
        this.player.setCover(this.courseInfo.cover)
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      } else {
        // 其他异常
        this.pausePlay()
        this.player.setCover(this.courseInfo.cover)
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.course-detail {
  overflow: hidden;
  width: 100%;
  padding-bottom: 100rpx;
}

.course-cover {
  width: 100%;
  height: 400rpx;
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