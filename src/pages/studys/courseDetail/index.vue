<template>
  <view class="course-detail">
    <custom-header :title="defaultTitle"></custom-header>
    <!-- #ifdef H5 -->
    <view id="aliplayer">
      <cover-view v-if="!player" class="course-cover">
        <image :src="courseInfo.cover" class="course-img" mode="aspectFill">
        <view class="play-icon">
          <uni-icons custom-prefix="iconfont" type="icon-play-filling" :size="64" color="#fff" @click="onStartVideo" />
        </view>
      </cover-view>
    </view>
    <!-- #endif -->

    <!-- 分段器 -->
    <view class="segmented-bar">
      <uni-segmented-control :current="current" :values="items" styleType="text" activeColor="#199fff"
                             @clickItem="onChangeSegmented" />
      <view class="segmented-content">
        <view v-show="current === 0" class="segmented-pane">
          <Details v-if="courseInfo" :info="courseInfo" :courseId="course_id" />
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
import CustomHeader from "@/components/custom-header"
import { browser, userStatus } from '@/mixins/index'
import {
  courseInfo,
  courseCommentSubmit,
  courseGetVideoAuth,
  courseRecordLearn,
  courseCommentHotWord,
} from '@/api/course'

export default {
  mixins: [browser, userStatus],
  components: {
    Details,
    Catalogue,
    Rate,
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '课程详情',

      region_id: 0,
      course_id: 0,
      lesson_id: 0,

      // 课程详情
      courseInfo: {},
      // 目录
      chapterList: [],
      // 评价
      up: { page: { num: 0, size: 10, time: 1000 } },
      tags: [],
      starText: ['', '不满意', '一般', '比较满意', '满意', '非常满意'],
      rateForm: { star: 1, comment: '', },

      // 分段器
      current: 0,
      items: ['简介', '目录', '评价'],

      // h5 视频 小程序视频
      player: null, // 播放器实例
      video: {}, // 视频播放
      lesson: {}, // 课时记录
      record: {}, // 学习记录
      face: [], // 人脸信息
      faceNap: {},  // 缓存验证记录
      user: [], // 用户信息相关
      intervalId: 0, //计时器
      time: 1000 * 10, // 记录时间
      end_time: 0,    // 终止时间
      prev_time: 0,   // 上次时间
      start_second: 0, // 当前时间
      
      // 实名与人脸验证
      canPlay: false,
      isFaceing: false,
      autoplay: false,
    }
  },
  onLoad(query) {
    this.init(query)
  },
  mounted() {
    document.addEventListener('visibilitychange', (state) => {
      console.log('visibilitychange', state);
      this.pausePlay()
      this.stopSend()
    })
  },
  onUnload() {
    clearInterval(this.intervalId)
    this.intervalId = null
    // #ifdef H5
    if (this.player) this.player.dispose();
    // #endif
  },
  methods: {
    init(query) {
      let { course_id, lesson_id, autoplay } = query
      this.course_id = +course_id
      this.lesson_id = +lesson_id
      this.autoplay = !!autoplay
      this.region_id = this.$store.getters.region.id
      uni.setStorageSync('course_id', course_id)
      this.getCourseInfo()
      this.getCommentHotWord()
    },
    getPath(url, query) {
      let params = ''
      Object.keys(query).forEach((key) => { params += `&${key}=${query[key]}` })
      return url + params.replace(/&?/, '?')
    },
    getQuery() {
      return {
        video: this.video,
        lesson: this.lesson,
        record: this.record,
        face: this.face,
        end_time: this.end_time,
        prev_time: this.prev_time,
        start_second: this.start_second,
        region_id: this.region_id,
        course_id: this.course_id,
        lesson_id: this.lesson_id,
      }
    },
    // 分段其切换
    onChangeSegmented({ currentIndex }) {
      this.current = currentIndex
    },
    // 我要评价
    onComment() {
      if (this.authority()) {
        this.$refs.popup.open()
      }
    },
    // 关闭评论
    onClose() {
      this.resetForm()
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
    // 获取评价热刺
    async getCommentHotWord() {
      let res = await courseCommentHotWord()
      if (res.code === 0) {
        let list = res.data.map((word, index) => ({ id: index, label: word, checked: false }))
        this.tags = list
      }
    },
    // 发表评论
    async onPublish() {
      let { star, comment } = this.rateForm
      let hot_word = this.tags.filter(filterItem => filterItem.checked).map(mapItem => mapItem.label)
      let params = { course_id: this.course_id, star: star, hot_word: hot_word, comment: comment }

      let res = await courseCommentSubmit(params)
      if (res.code === 0) {
        uni.showToast({ title: '评论陈功' , icon: 'icon' })
        this.$refs['rate'].downCallback()
        this.$refs['rate'].getCourseCommentCount()
        this.onClose()
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },
    // 获取课程详情
    async getCourseInfo() {
      let { region_id, course_id, lesson_id } = this.getQuery()
      let param = { region_id, course_id }
      let res = await courseInfo(param)
      if (res.code === 0) {
        let last_lesson_id = lesson_id ? lesson_id : res.data.learning_lesson_id
        this.lesson_id = last_lesson_id
        this.courseInfo = res.data
        if (this.autoplay) {
          this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: last_lesson_id })    
        }
      }
    },
    // 课时目录更改
    onChangeVideo(detailArr) {
      // console.log('detailArr', detailArr);
      let curr = detailArr[detailArr.length -1]
      this.lesson_id = curr.id
      this.changeSend()
      this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: curr.id })
    },
    // 点击开始播放
    onStartVideo() {
      this.autoplay = true
      this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: this.lesson_id })
    },
    // 错误码提示
    showToast(title, code, data) {
      if (code === 2201) {
        this.prev_time = +data.last_second
        this.finish_second = +data.finish_second
      } else if (code === 2203) {
        if (!this.isFaceing) {
          this.needFaceVerifity(+data.start_second)
        }
        this.isFaceing = true
      } else {
        uni.showToast({ title, icon: 'none' })
      }
    },
    // 随堂测试
    showModalForExamination(path) {
      uni.showModal({
        title: '提示',
        content: '本次学习需要进行随堂考试,每道题目限时60秒,每次考试有5次机会,测评合格后(≥80分)将计入相应学时',
        cancelText: '取消',
        confirmText: '开始考试',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            this.$store.commit('SET_EXAMINATION', true)
            uni.navigateTo({ url: path })
          }
        }
      })
    },
    // 人脸验证
    showModalForFaceVerifity(faceTime) {
      let url = `/pages/studys/faceVerification/index`
      let query = {
        lesson_id: this.lesson_id, 
        course_id: this.course_id,
        end_second: faceTime
      }
      let path = this.getPath(url, query)

      uni.showModal({
        title: '提示',
        content: '请人脸核验成功后再继续学习',
        cancelText: '取消',
        confirmText: '开始验证',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            uni.redirectTo({ url: path })
          }
        }
      })
    },
    // 实名认证
    showModalForRealVerification() {
      let url = `/pages/studys/realVerification/index`
      let query = { 
        lesson_id: this.lesson_id,
        course_id: this.course_id,
        end_second: this.player.getCurrentTime()
      }
      let path = this.getPath(url, query)

      uni.showModal({
        title: '提示',
        content: '根据安全生产资格考试网络培训管理办法规定， 此 课程需要通过实名认证后才能开始学习。',
        cancelText: '取消',
        confirmText: '开始验证',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            uni.navigateTo({ url: path })
          }
        }
      })
    },
    // 播放结束提示框
    showModal() {
      let url = `/pages/studys/classTestMode/answer/index`
      let { lesson_id, course_id, lesson, start_second } = this.getQuery()
      let query = { lesson_id, course_id }
      let path = this.getPath(url, query)
      let is_free = lesson.is_free
      let free_second = lesson.free_second
      let distance = Math.abs(free_second - start_second)
      let is_practice = lesson.is_practice
      let is_done = lesson.is_done
      
      if (free_second && distance <= 2) {
        this.showToast('试看结束')
      } else if (is_practice && !is_done) {
        this.showModalForExamination(path)
      }
    },
    setCover(url) {
      if (this.player) this.player.setCover(url);
    },
    needFaceVerifity(currTime) {
      let faceTime = this.face[0]

      if (faceTime !== undefined && currTime - faceTime >= 0 ) {
        this.canPlay = false
        if (this.user.real_status) {
          this.showModalForFaceVerifity(faceTime)
        } else {
          this.showModalForRealVerification()
        }
      } else {
        this.canPlay = true
      }
    },

    // 停止计时器
    stopInterval() {
      clearInterval(this.intervalId)
      this.intervalId = null
    },
    stopSend() {
      this.stopInterval()
      let end_time = this.player.getCurrentTime()
      this.sendData(this.lesson_id, end_time, end_time)
    },
    changeSend() {
      this.stopInterval()
      if (this.player) {
        let end_time = this.player.getCurrentTime()
        this.sendData(this.lesson_id, end_time, end_time)
      }
    },
    // 不同状态数据发送
    playSendData() {
      if (this.intervalId) { clearInterval(this.intervalId); this.intervalId = null; }
      this.intervalId = setInterval(() => {
        let end_time = this.player.getCurrentTime()
        this.sendData(this.lesson_id, this.prev_time, end_time)
      }, this.time)
    },
    pauseSendData() {
      this.stopInterval()
      let end_time = this.player.getCurrentTime()
      this.sendData(this.lesson_id, this.prev_time, end_time)
    },
    seekSendData() {
      let end_time = this.player.getCurrentTime()
      this.sendData(this.lesson_id, end_time, end_time)
    },
    endedSendData() {
      this.stopInterval()
      let end_time = this.player.getCurrentTime()
      this.sendData(this.lesson_id, this.prev_time, end_time)
    },
    errSendData() {
      this.stopInterval()
      if (this.player) {
        this.player.setCover(this.courseInfo.cover);
        let end_time = this.player.getCurrentTime()
        this.sendData(this.lesson_id, this.prev_time, end_time)
      } else {
        this.setCover(this.courseInfo.cover)
      }
    },
    // 不同状态事件回调
    endedCallback() {
      this.endedSendData()
      this.showModal()
    },
    pauseAndSendData() {
      if (this.player) this.player.pause();
      this.pauseSendData()
    },
    pausePlay() {
      if (this.player) this.player.pause();
      this.stopInterval()
    },
    
    // 创建播放器
    createPlayer(options) {
      if (this.player) this.player.dispose();
      let { video, } = options

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
          { name: "bigPlayButton", align: "cc", x: 30, y: 80 },
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
        vid: video.id,
        playauth: video.auth_data.PlayAuth,
        cover: video.cover,
        duration: video.duration,
        encryptType: 0
      }, (player) => {
        player.on('ready', () => {
          console.log('ready');
          if (this.lesson.free_second) player.setPreviewTime(this.lesson.free_second);
          player.seek(this.start_second)
          if (this.autoplay) player.play();
        })
        player.on('play', () => {
          console.log('play');
          this.needFaceVerifity(this.start_second)
          if (this.canPlay) {
            this.isFaceing = false
            this.playSendData()
          } else {
            this.pauseSendData()
            player.pause()
          }
        })
        player.on('pause', () => {
          console.log('pause');
          this.pauseSendData()
        })
        player.on('ended', () => {
          console.log("ended");
          this.endedCallback()
        })
        player.on('timeupdate', () => {
          // console.log('timeupdate');
          let currTime = player.getCurrentTime()
          let start_second = this.start_second
          let is_free = this.lesson.is_free
          let is_forward = this.lesson.is_forward
          let finish_second = this.record.finish_second
          let distance = currTime - start_second
          let faceTime = this.face[0]

          if (is_free || is_forward || start_second < finish_second) {
            this.start_second = currTime
            if (Math.abs(distance) >= 2) this.sendData(this.lesson_id, currTime, currTime);
          } else {
            if (distance >= 2) {
              player.seek(start_second)
            } else if (Math.abs(distance) >= 2) {
              this.start_second = currTime
              this.sendData(this.lesson_id, currTime, currTime)
            } else {
              this.start_second = currTime
              if (faceTime !== undefined && (currTime - faceTime) >= 0 ) {
                player.pause()
              }
            }
          }
        })
        player.on('completeSeek', (e) => {
          console.log('completeSeek');
          this.seekSendData()
        })
        player.on('error', () => {
          console.log('error');
          this.player.pause()
          this.errSendData()
        })
      })
    },
    // 发送数据
    async sendData(lesson_id, start_second, end_second) {
      let params = { lesson_id, start_second, end_second }
      let res = await courseRecordLearn(params)
      if (res.code === 0) {
        this.finish_second = +res.data.finish_second
        this.prev_time = +res.data.last_second
      } else {
        this.showToast(res.message, res.code, res.data)
      }
    },
    // 获取视频凭证
    async getCourseGetVideoAuth(params) {
      let res = await courseGetVideoAuth(params)
      let { video, lesson, record, face, user } = res.data
      
      if (res.code === 0) {
        this.video = video
        this.lesson = lesson
        this.record = record
        this.face = face
        this.user = user
        this.start_second = +record.start_second
        this.prev_time = +record.finish_second

        // #ifdef H5
        this.createPlayer({ video })
        // #endif
      } else {
        this.showToast(res.message, res.code, res.data)
        this.errSendData()
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
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}

.play-icon {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  z-index: 999;
  background-color: #000;
}

.course-img {
  width: 100%;
  height: 200px;
  z-index: 99;
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