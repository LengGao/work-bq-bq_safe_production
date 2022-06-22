<template>
  <view class="course-detail">
    <custom-header :title="defaultTitle"></custom-header>
    <!-- #ifdef H5 -->
    <view id="aliplayer">
      <cover-view v-if="!canPlay" class="course-cover">
        <image :src="courseInfo.cover" class="course-img" mode="aspectFill">
          <view class="play-icon">
            <uni-icons custom-prefix="iconfont" type="icon-play-filling" :size="64" color="#fff"
                       @click="onStartVideo" />
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
                     @videoChange="onChangeVideo" @last-lesson-id="getLastLessonId" />
        </view>
        <view v-show="current === 2" class="segmented-pane">
          <Rate ref="rate" :courseId="course_id" @openComment="onComment" />
        </view>
      </view>
    </view>

    <uni-popup ref="popup" type="center" class="popup">
      <div class="dialog">
        <view class="dialog-title">我的评价</view>
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

    <uni-popup ref="faceVerification" class="face-verification" type="center" @change="onfaceVerificationChange">
      <FaceVerification :lessonId="lesson_id" :courseId="course_id" :endSecond="faceTime"
                        @FaceVerifitySuccess="onFaceVerifitySuccess" />
    </uni-popup>

    <uni-popup ref="realVerification" class="real-verification" type="center" @change="onfaceVerificationChange">
      <RealVerification @RealVerifitynSuccess="onRealVerifitynSuccess" />
    </uni-popup>

  </view>
</template>

<script>
import Details from './components/Details'
import Catalogue from "./components/Catalogue"
import Rate from './components/Rate'
import FaceVerification from './components/faceVerification'
import RealVerification from './components/realVerification'
import CustomHeader from "@/components/custom-header"
import { browser, userStatus } from '@/mixins/index'
import {
  courseInfo,
  courseCommentSubmit,
  courseGetVideoAuth,
  courseRecordLearn,
  courseCommentHotWord,
  checkCourseGraduated,
} from '@/api/course'

export default {
  mixins: [browser, userStatus],
  components: {
    Details,
    Catalogue,
    Rate,
    FaceVerification,
    RealVerification,
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
      user: [], // 用户信息相关
      intervalId: 0, //计时器
      time: 1000 * 10, // 记录时间
      end_time: 0,    // 终止时间
      prev_time: 0,   // 上次时间
      start_second: 0, // 当前时间

      // 实名与人脸验证
      canPlay: false,  // 约束是否能播放
      faceTime: 0,  
      isFaceing: false,
      isTesting: false,
      isRealing: false,
      overFinish: false,
      autoplay: 0,
      getVideoErr: '',
      jumpCount: 0,
    }
  },
  onLoad(query) {
    this.init(query)
  },
  mounted() {
    document.addEventListener('visibilitychange', this.documentHide)
  },
  beforeDestroy() {
    document.removeEventListener("visibilitychange", this.documentHide);
  },
  onUnload() {
    this.destroyInterval()
    this.clearPlayer()
  },
  methods: {
    init(query) {
      let { course_id, lesson_id, autoplay } = query
      this.course_id = +course_id
      this.lesson_id = +lesson_id
      this.autoplay = +autoplay

      this.region_id = this.$store.getters.region.id
      uni.setStorageSync('course_id', course_id)

      this.getCourseInfo()
      this.getCommentHotWord()
      if (this.lesson_id) {
        this.canPlay = true
        this.getCourseGetVideoAuth({ lesson_id: this.lesson_id, region_id: this.region_id })
      }
    },
    documentHide() {
      if (document.hidden) {
        this.player && this.player.pause();
        document.querySelector(".prism-big-play-btn").style.display = "block";
      }
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
        uni.showToast({ title: '评论陈功', icon: 'icon' })
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
        this.courseInfo = res.data
        this.lesson_id = last_lesson_id

      } else if (res.code === 2998) {
        uni.showToast({ title: '课程已下架', icon: 'none' })
        goBack()
      } else if (res.code === 2999) {
        uni.showToast({ title: '课程不存在或被删除', icon: 'none' })
        goBack()
      }
    },
    // 随堂测试
    showModalForExamination() {
      this.isTesting = true
      let url = `/pages/studys/classTestMode/answer/index`
      let { lesson_id, course_id } = this.getQuery()
      let query = { lesson_id, course_id }
      let path = this.getPath(url, query)

      uni.showModal({
        title: '提示',
        content: `本次学习需要进行随堂考试,每道题目限时60秒,每次考试有5次机会,测评合格后(≥80分)将计入相应学时`,
        cancelText: '取消',
        confirmText: '开始考试',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            this.$store.commit('SET_EXAMINATION', true)
            setTimeout(() => { uni.redirectTo({ url: path }) }, 500)
          }
        }
      })
    },
    onFaceVerifitySuccess(result) {
      if (result) {
        this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: this.lesson_id })
      }
      this.closeFaceVerifity()
    },
    showFaceVerifity() {
      this.$refs['faceVerification'].open()
    },
    closeFaceVerifity() {
      this.$refs['faceVerification'].close()
    },
    onfaceVerificationChange(e) {
      console.log('onfaceVerificationChange', e);
    },
    // 人脸验证
    showModalForFaceVerifity(faceTime) {
      this.isFaceing = true
      this.faceTime = faceTime

      uni.showModal({
        title: '提示',
        content: '请人脸核验成功后再继续学习',
        cancelText: '取消',
        confirmText: '开始验证',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            this.showFaceVerifity()
          }
        }
      })
    },
    onRealVerifitynSuccess() {
      this.closeRealVerifity()
      this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: this.lesson_id })
    },
    showRealVerifity() {
      this.$refs['realVerification'].open()
    },
    closeRealVerifity() {
      this.$refs['realVerification'].close()
    },
    // 实名认证
    showModalForRealVerification() {
      this.isRealing = true
      uni.showModal({
        title: '提示',
        content: '根据安全生产资格考试网络培训管理办法规定， 此 课程需要通过实名认证后才能开始学习。',
        cancelText: '取消',
        confirmText: '开始验证',
        cancelColor: '#199fff',
        confirmColor: '#199fff',
        success: (res) => {
          if (res.confirm) {
            this.showRealVerifity()
          }
        }
      })
    },
    // 生成证书
    showModalForFininsh() {
      let course_id = this.course_id
      const cancelCallback = () => {
        let url = `/pages/studys/learningRecords/index?course_id=${course_id}`
        uni.navigateTo({ url })
      }

      const confirmCallback = () => {
        let url = `/pages/studys/learningCertificate/index?course_id=${course_id}`
        uni.navigateTo({ url })
      }

      // uni.showModal({
      //   title: '提示',
      //   content: `您已完成本课程所有课时的学习和考试，顺利毕业啦(*^▽^*)！`,
      //   cancelText: '查看学习记录',
      //   confirmText: '生成证书',
      //   cancelColor: '#199fff',
      //   confirmColor: '#199fff',
      //   success: (res) => {
      //     if (res.confirm) {
      //       confirmCallback()
      //     }
      //     if (res.cancel) {
      //       cancelCallback()
      //     }
      //   }
      // })
    },
    getLastLessonId(lessonId) {
      this.lesson_id = lessonId
    },
    onChangeVideo(detailArr) {
      // 先发送记录
      this.stopInterval()
      // 再更新
      let curr = detailArr[detailArr.length - 1]
      this.lesson_id = curr.id
      this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: curr.id })
    },
    onStartVideo() {
      this.canPlay = true
      this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: this.lesson_id })
    },
    jumpVideo(lesson_id) {
      if (!this.jumpCount) {
        this.getCourseGetVideoAuth({ region_id: this.region_id, lesson_id: lesson_id })
        this.jumpCount = 1
      }
    },
    setCover(url) {
      if (this.player) this.player.setCover(url);
    },
    getVideoMessage(res) {
      uni.showToast({ title: res.message, icon: 'none' })

      if (res.code === 2201) {
        this.lesson_id = res.data.lesson_id
        this.jumpVideo(res.data.lesson_id)
        return;
      }

      if (res.data.cover) this.setCover(res.data.cover);
      this.getVideoErr = res.message
      this.canPlay = false
    },
    recondMessage(res) {
      uni.showToast({ title: res.message, icon: 'none' })
    },
    showVideoMessage(message) {
      uni.showToast({ title: message, icon: 'none' })
    },
    hidePlayerBtns(otherSelector = []) {
      const selectors = [
        ".prism-setting-audio",
        ".prism-setting-cc",
        ".prism-cc-btn",
      ].concat(otherSelector);
      selectors.forEach((selector) => {
        document.querySelector(selector).style.display = "none";
      });
    },
    clearPlayer() {
      if (this.player) {
        this.player.dispose()
        this.player = null
      }
    },
    createPlayer(options) {
      let { video, lesson, record, face, user, autoplay } = options
      
      this.clearPlayer()

      this.player = new Aliplayer({
        id: 'aliplayer',
        width: '100%',
        height: '200px',
        controlBarVisibility: 'click',
        isLive: false,
        playsinline: true,
        preload: true,
        useH5Prism: true,
        x5_type: "H5",
        vid: video.id,
        playauth: video.auth_data.PlayAuth,
        cover: video.cover,
        autoplay: true,
        encryptType: 0,
        skinLayout: [
          { name: "bigPlayButton", align: "cc" },
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
              { name: "setting", align: "tr", x: 15, y: 12 },
              { name: "volume", align: "tr", x: 5, y: 10 },
            ],
          },
        ],
      }, (player) => {
        // 隐藏倍速按钮
        if (!lesson.is_free && !lesson.is_forward) {
          this.hidePlayerBtns([".prism-setting-speed"]);
        } else {
          this.hidePlayerBtns();
        }
        // 播放结束
        let isPlayEnd = false;
        // 已完成的课时时长
        let finish_second = record.finish_second;
        // 设置上次播放时间
        this.start_second = record.start_second;
        // 人脸时间
        let faceTime = face[0]

        player.on('ready', () => {
          // alert('ready')
          player.play()
        })

        player.on('canplay', () => {
          this.canPlay = true
        })

        player.on('loadeddata', () => {
          player.seek(this.start_second);
        })

        player.on('pause', () => {
          // console.log('pause');
          this.stopInterval()
        })

        player.on('play', () => {
          this.startInterval()
        })

        // 开始拖拽
        player.on("startSeek", () => {
          // console.log('startSeek');
          this.stopInterval();
        })

        // 结束拖拽
        player.on("completeSeek", () => {
          this.startInterval()
        })

        player.on('ended', () => {
          console.log("ended");
          isPlayEnd = true;
          // 看完显示倍速
          if (!lesson.is_free && !lesson.is_forward) {
            document.querySelector(".prism-setting-speed").style.display = "block";
          }
          // 随堂考试
          if (lesson.is_practice && !lesson.is_done) {
            this.isTesting = true;
            player.pause()
            this.showModalForExamination()
          }
          // 是否学完
          if (this.userStatus === 1) {
            player.pause()
            this.checkCourseGraduated()
          }

          // 重置播放开始时间
          this.start_second = 0;
          player.seek(this.start_second);
        })

        player.on('timeupdate', () => {
          // 当前时间
          const currentTime = player.getCurrentTime();
          // console.log(currentTime, faceTime);
          // 没看完禁止拖拽进度条
          if (!lesson.is_free && !lesson.is_forward && !isPlayEnd) {
            if (currentTime - finish_second >= 1) {
              player.seek(finish_second);
              uni.showToast({ title: '禁止快进学习', icon: 'none' })
              return;
            } else {
              currentTime > finish_second && (finish_second = currentTime);
            }
          }

          // 试看结束 freeSecond:试看时长（秒）
          if (lesson.free_second && currentTime >= lesson.free_second) {
            player.pause()
            this.showVideoMessage('试看结束，如需购买前联系客服');
          }
          // 到达人脸核验时间
          if (faceTime !== undefined && currentTime >= faceTime) {
            player.pause()
            this.stopInterval()
            this.showVideoMessage('请完成人脸核验后继续学习');
            this.showModalForFaceVerifity(faceTime)
          }
        })
      })
    },
    // 计时器相关
    destroyInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    },
    stopInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
        this.sendData()
      }
    },
    startInterval() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
      this.intervalId = setInterval(() => {
        this.sendData()
      }, this.time)
    },

    async sendData() {
      const currentTime = this.player.getCurrentTime();

      const params = {
        start_second: this.start_second,
        end_second: currentTime,
        lesson_id: this.lesson_id,
        region_id: this.region_id,
      };

      let res = await courseRecordLearn(params)
      if (res.code !== 0) {
        if (res.data.finish_second !== undefined) {
          this.player.seek(res.data.finish_second);
          this.start_second = res.data.finish_second;
          return;
        } else {
          this.player.pause()
        }
      }

      this.start_second = currentTime;
    },

    // 获取视频
    async getCourseGetVideoAuth(params, autoplay = true) {
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

        if (lesson.is_in_exam && lesson.is_practice && this.userStatus === 1) {
          this.canPlay = false
          if (this.player) this.player.pause();
          this.showModalForExamination()
          return;
        }

        if (!user.real_status && this.userStatus === 1) {
          this.canPlay = false
          if (this.player) this.player.pause();
          this.showModalForRealVerification()
          return;
        }

        // #ifdef H5
        this.createPlayer({ video, lesson, record, face, user, autoplay })
        // #endif
      } else {
        this.getVideoMessage(res)
      }
    },

    // 检查是否播放结束
    async checkCourseGraduated() {
      let res = await checkCourseGraduated({ course_id: this.course_id })
      if (res.code === 0) {
        if (res.data) {
          this.showModalForFininsh()
        }
      }
    }
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

#aliplayer {
  height: 200px;
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
  z-index: 100;
  background-color: #000;
}

::v-deep .prism-setting-speed {
  display: none !important;
}

::v-deep .prism-big-play-btn {
  z-index: 555;
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

.face-verification {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}

.real-verification {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
}
</style>