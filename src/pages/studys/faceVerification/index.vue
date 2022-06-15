<template>
  <view class="face-verification">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="face">
      <view class="title">
        {{ messageErr }}
      </view>

      <view class="face-container">
        <video class="face-video" id="video" :duration="0" :show-loading="false" :show-fullscreen-btn="false"
               :enable-progress-gesture="false" :show-progress="false" :controls="false" :show-center-play-btn="false"
               :show-play-btn="false" />
      </view>

      <view class="dialog-footer">
        <button class="btn-primary" v-if="!showRestartBtn" :disabled="btndisabled" size="small"
                @click="handleOk">开始认证</button>
        <button class="btn-primary" v-else size="small" @click="init">重新验证</button>
      </view>
    </view>

  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { faceUpload } from '@/api/course'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '人脸认证',
      devicesState: '', // 设备状态
      messageErr: '请将面部置于方框内，点击开始认证',
      btndisabled: false,
      verificationStatus: false,
      showRestartBtn: false,

      strem: null,
      video: null,
      videoSize: { facingMode: 'user', width: 300, height: 300 },
      canvas: null,
      image: null,
  
      course_id: 0,
      lesson_id: 0,
      end_second: 0,

      timer: 0,
      src: '',

      errMsgMap: {
        'AbortError': '终止错误',
        'NotAllowedError': '摄像头启用被禁止，请允许后重试',
        'NotReadableError': '摄像头不可用，请检查后重试',
        'NotFoundError': '找不到媒体类型错误',
        'NotReadableError': '无法读取错误',
        'OverconstrainedError': '无法满足要求错误',
        'OverconstrainedError': '安全错误',
        'TypeError': '类型错误'
      }
    }
  },
  onLoad(query) {
    let { course_id, lesson_id, end_second } = query
    this.course_id = +course_id
    this.lesson_id = +lesson_id
    this.end_time = +end_second
    this.init()
  },
  mounted() {
    this.mountedDom()
  },
  onUnload() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init() {
      if (this.strem) { this.strem.getTracks().forEach((track) => track.stop()); }
      this.checkSetting()
    },
    mountedDom() {
      let videoParent = document.getElementById('video'),
          canvas = document.createElement('canvas'),
          image = document.createElement('image')

      let video = videoParent.children[0].children[0]

      this.video = video
      this.canvas = canvas
      this.image = image

      if (this.devicesState === 'unkonw') {
        uni.showToast({ title: '未获取到设备信息，请检查您的设备或系统权限设置', icon: 'none' })
      } else {
        this.geMediaDevices({ video: this.videoSize })
      }
    },
    // 检查设备情况
    checkSetting() {
      console.log('navigator.mediaDevices)', navigator.getUserMedia);
      if (navigator.mediaDevices) {
        this.devicesState = 'mediaDevices.getUserMedia'
      } else if (navigator.webkitGetUserMedia) {
        this.devicesState = 'webkitGetUserMedia'
      } else if (navigator.mozGetUserMedia) {
        this.devicesState = 'mozGetUserMedia'
      } else if (navigator.getUserMedia) {
        this.devicesState = 'getUserMedia'
      } else {
        this.messageErr = '无法开启摄像头'
        this.devicesState = 'unkonw'
      }
    },
    // 媒体掉用成功
    handlerSuccess(strem) {
      console.log('strem', strem);
      this.btndisabled = false
      this.strem = strem
      this.video.srcObject = strem
      this.video.play()
    },
    // 媒体嗲用异常
    handlerError(error) {
      console.log('error', error);
      this.btndisabled = true
      this.showRestartBtn = true
      let messageErr = `${this.errMsgMap[error.name]}`
      uni.showToast({ title: messageErr, icon: 'none' })
    },
    // 获取媒体
    geMediaDevices(constraints) {
      let devicesState = this.devicesState
      console.log('devicesState', devicesState);
      if (devicesState === 'mediaDevices.getUserMedia') {
        navigator.mediaDevices.getUserMedia(constraints).then(this.handlerSuccess).catch(this.handlerError)
      } else if (devicesState !== 'unkonw'){
        navigator[devicesState](constraints, this.handlerSuccess, this.handlerError)
      }
    },
    // 开始雅正
    handleOk() {
      console.log('handleOk');
      this.btndisabled = true
      this.timer = setInterval(() => {
        if (this.verificationStatus) {
          clearInterval(this.timer)
          this.timer = null
        } else {
          this.sendData()
        }
      }, 1000)
    },
    // 获取数据 
    getMediaData() {
      let video = this.video,
          videoSize = this.videoSize,
          image = this.image,
          canvas = this.canvas,
          context = canvas.getContext('2d'),
          base64 = ''

      let scale = videoSize.width / 2
      let clinp = videoSize.width

      video.width = videoSize.width
      video.height = videoSize.height
      video.naturalWidth = videoSize.width
      video.naturalHeight = videoSize.height
      canvas.width = videoSize.height * 2
      canvas.height = videoSize.height * 2

      context.drawImage(video, 0, 0, clinp, clinp, 0, 0, scale, scale)
      image = canvas.toDataURL('image/png', 1)
      base64 = image.split(';base64,')[1]
      return { lesson_id: this.lesson_id, end_second: this.end_second, photo: base64 }
    },

    stopStrem() {
      if (this.strem) {
        this.strem.getTracks().forEach((track) => track.stop());
      }
    },
    verifiSuccess() {
      let course_id = this.course_id
      let lesson_id = this.lesson_id
      let end_second = this.end_second
      let url = `/pages/studys/courseDetail`
      let query = `?course_id=${course_id}&lesson_id=${lesson_id}&end_second=${end_second}`

      this.verificationStatus = true
      this.btndisabled = false
      this.messageErr = '验证通过'
      uni.redirectTo({ url: url + query })
      this.stopStrem()
    },
    verifierror() {
      this.verificationStatus = false
      this.countError++;

      if (this.countError > 20) {
        this.btndisabled = false
        clearInterval(this.timer)
        this.timer = null
        this.messageErr = '人脸验证失败, 请重新验证'
      }
    },
    // 发送数据
    async sendData() {
      let params = this.getMediaData()
      console.log('sendData', params);
      let res = await faceUpload(params)
      if (res.code === 0) {
        this.verifiSuccess()
      } else {
        this.messageErr = res.message
      }
    },
  }
}
</script>

<style lang="scss" scoped>
.face-verification {
  width: 100%;
  height: 100%;
}

.face {
  margin-top: 60rpx;
  .title {
    text-align: center;
  }
  .face-container {
    margin-top: 60rpx;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .face-video {
    width: 320px;
    height: 320px;
    border: 2px solid transparent;
    border-radius: 50%;
  }
}
.dialog-footer {
  position: absolute;
  bottom: var(--window-bottom);
  left: 0;
  width: 100%;

  .btn-primary {
    margin: 30rpx;
    color: #fff;
    font-size: 32rpx;
    background-color: #199fff;
    border-radius: 12rpx;
  }
}
</style>