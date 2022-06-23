<template>
  <view class="face-verification">
    <custom-header :title="defaultTitle" ></custom-header>

    <view class="face">
      <view class="title">
        {{ toastMsg }}
      </view>

      <view class="face-container">
        <video class="face-video" id="video" :duration="0" :show-loading="false" :show-fullscreen-btn="false"
               :enable-progress-gesture="false" :show-progress="false" :controls="false" :show-center-play-btn="false"
               :show-play-btn="false">
          <cover-view v-if="verificationStatus" class="cover">
            <uni-icons customPrefix="iconfont" type="icon-zhengquetishitianchong" size="320" color="#3EC100" />
          </cover-view>
        </video>
      </view>

      <view class="dialog-footer">
        <button class="btn-primary" v-if="!showRestartBtn" :disabled="btndisabled" size="small"
                :class="btndisabled ? 'btn-disabled' : ''" @click="handleOk">开始认证</button>
        <button class="btn-primary" v-else size="small" @click="reStart">重新获取设备</button>
      </view>
    </view>
  </view>
</template>

<script>
import { faceUpload } from '@/api/course'
import CustomHeader from "@/components/custom-header"

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '人脸认证',
      devicesState: '', // 设备状态
      toastMsg: '请将面部置于方框内，点击开始认证',
      verificationStatus: false,
      btndisabled: false,
      showRestartBtn: false,
      timer: 0,
      countError: 0,

      strem: null,
      video: null,
      canvas: null,
      image: null,
      fragment: null,
      videoSize: { facingMode: 'user', width: 300, height: 300 },

      endSecond: 0,
      lessonId: 0,


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
    let { lesson_id, end_second } = query
    this.lessonId = +lesson_id
    this.endSecond = +end_second
    this.init()
  },
  mounted() {
    this.mountedDom()
  },
  destroyed() {
    this.clearStrem()
    this.clearTimer()
  },
  onUnload() {
    this.clearStrem()
    this.clearTimer()
  },
  methods: {
    init() {
      this.clearStrem()
      this.clearTimer()
      this.checkSetting()
      this.tryGetDevices()
    },
    mountedDom() {
      let videoParent = document.getElementById('video'),
        canvas = document.createElement('canvas'),
        image = document.createElement('image'),
        fragment = document.createDocumentFragment()

      let video = videoParent?.children[0]?.children[0]

      this.video = video
      this.canvas = canvas
      this.image = image

      fragment.appendChild(canvas)
      fragment.appendChild(image)

      this.fragment = fragment
    },
    checkSetting() {
      if (navigator.mediaDevices) {
        this.devicesState = 'mediaDevices.getUserMedia'
      } else if (navigator.webkitGetUserMedia) {
        this.devicesState = 'webkitGetUserMedia'
      } else if (navigator.mozGetUserMedia) {
        this.devicesState = 'mozGetUserMedia'
      } else if (navigator.getUserMedia) {
        this.devicesState = 'getUserMedia'
      } else {
        this.devicesState = 'unkonw'
      }
    },
    tryGetDevices() {
      if (this.devicesState === 'unkonw') {
        uni.showToast({ title: '未获取到设备信息，请检查您的设备或系统权限设置', icon: 'none' })
      } else {
        this.geMediaDevices({ video: this.videoSize })
      }
    },
    geMediaDevices(constraints) {
      let devicesState = this.devicesState
      if (devicesState === 'mediaDevices.getUserMedia') {
        navigator.mediaDevices.getUserMedia(constraints).then(this.handlerSuccess).catch(this.handlerError)
      } else if (devicesState !== 'unkonw') {
        navigator[devicesState](constraints, this.handlerSuccess, this.handlerError)
      } else {
        uni.showToast({ title: '未获取到设备信息，请检查您的设备或系统权限设置', icon: 'none' })
      }
    },
    reStart() {
      this.init()
    },
    handleOk() {
      this.btndisabled = true
      this.sendData()
    },
    goback() {
      history.back()
    },
    handlerSuccess(strem) {
      // console.log('strem', strem) 
      this.showRestartBtn = false
      this.strem = strem
      this.video.srcObject = strem
      this.video.play()
    },
    handlerError(error) {
      // console.log('error', error)
      this.showRestartBtn = true
      let toastMsg = `${this.errMsgMap[error.name]}`
      uni.showToast({ title: toastMsg, icon: 'none' })
    },
    getMediaData() {
      let video = this.video
      let videoSize = this.videoSize
      let image = this.image
      let canvas = this.canvas
      let context = canvas.getContext('2d')
      let base64 = ''

      video.width = videoSize.width
      video.height = videoSize.height
      video.naturalWidth = videoSize.width
      video.naturalHeight = videoSize.height
      canvas.width = 800
      canvas.height = 800

      context.drawImage(video, 0, 0, 800, 800)
      image = canvas.toDataURL('image/png', 1)
      base64 = image.split(';base64,')[1]
      return { lesson_id: this.lessonId, end_second: this.endSecond, photo: base64 }
    },

    // 验证成功
    verifiSuccess() {
      this.verificationStatus = true
      this.btndisabled = false
      this.toastMsg = '验证通过'
      uni.showToast({ title: '验证通过', icon: 'none' })
      this.clearStrem()
      setTimeout(() => { this.goback() }, 800)
    },
    // 验证失败
    verifierror(message) {
      this.verificationStatus = false
      this.toastMsg = message
      this.countError++;

      if (this.countError > 3) {
        this.btndisabled = false
        this.clearTimer()
        this.toastMsg = '人脸验证失败, 请重新验证'
      }
    },
    // 发送数据
    async sendData() {
      let params = this.getMediaData()
      let res = await faceUpload(params)
      if (res.code === 0) {
        this.verifiSuccess()
      } else {
        this.verifierror(res.message)
        this.timer = setTimeout(() => { this.sendData() }, 500)
      }
    },

    clearStrem() {
      if (this.strem) {
        this.strem.getTracks().forEach((track) => track.stop());
        this.strem = null
      }
    },
    clearTimer() {
      if (this.timer) {
        clearTimeout(this.timer)
        this.timer = null
      }
    },
    destroyDom() {
      if (this.image) {
        this.fragment.removeChild()
        this.image = null
      }
      if (this.canvas) {
        this.fragment = removeChild(this.canvas)
        this.canvas = null
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

.cover {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-footer {
  position: fixed;
  bottom: 30rpx;
  left: 0;
  width: 100%;

  .btn-primary {
    margin: 30rpx;
    color: #fff;
    font-size: 32rpx;
    background-color: #199fff;
    border-radius: 12rpx;
  }

  .btn-disabled {
    opacity: 0.3;
  }
}
</style>