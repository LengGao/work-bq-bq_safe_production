<template>
  <view class="face-verification">
    <custom-header :title="defaultTitle"></custom-header>

    <view class="face" v-if="real_status">
      <view class="title">
        {{ messageErr }}
      </view>

      <view class="face-container">
        <video class="face-video" id="video" :duration="0" :show-loading="false" :show-fullscreen-btn="false"
               :enable-progress-gesture="false" :show-progress="false" :controls="false" :show-center-play-btn="false"
               :show-play-btn="false" />
      </view>
    </view>

    <view class="real" v-else>
      <view class="title">上传证件照</view>
      <view class="img-box one" :style="uploadOne ? success : ''" @click="() => onUpload(1)">
        <image class="img" :src="uploadOne || placeholderOne" mode="aspectFill" :style="uploadOne ? success : ''" />

        <view class="upload-status">
          <view class="upload-icon" :style="uploadOne ? success : ''">
            <uni-icons customPrefix="iconfont" type="icon-zhengquetishitianchong" size="74rpx" color="#3EC100"
                       v-if="uploadOne" />
            <uni-icons customPrefix="iconfont" type="icon-shangchuan-copy" size="48rpx" color="#fff" v-else />
          </view>
          <view class="text">{{ uploadOne ? '上传成功!'  : '上传身份证人面像' }}</view>
        </view>
      </view>

      <view class="img-box tow" :style="uploadTow ? success : ''" @click="() => onUpload(2)">
        <image class="img" :src="uploadTow || placeholderTwo" mode="aspectFill" :style="uploadTow ? success : ''" />

        <view class="upload-status">
          <view class="upload-icon" :style="uploadTow ? success : ''">
            <uni-icons customPrefix="iconfont" type="icon-zhengquetishitianchong" size="74rpx" color="#3EC100"
                       v-if="uploadTow" />
            <uni-icons customPrefix="iconfont" type="icon-shangchuan-copy" size="48rpx" color="#fff" v-else />
          </view>
          <view class="text">{{ uploadTow ? '上传成功!'  : '上传身份证国徽面' }}</view>
        </view>
      </view>

      <view class="bottom">
        注：根据安全生产资格考试网络培训管理办法规定， 此 课程需要通过实名认证后才能开始学习。
      </view>
    </view>

    <view class="dialog-footer">
      <button class="btn-primary" v-if="!real_status" @click="updateIdCardImg">人脸识别</button>
      <button class="btn-primary" v-else-if="showRestartBtn" :disabled="btndisabled" size="small"
              @click="handleOk">开始认证</button>
      <button class="btn-primary" v-else size="small" @click="handleOk">重新验证</button>
    </view>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import placeholderOne from '@/pages/studys/static/idcard1.jpg'
import placeholderTwo from '@/pages/studys/static/idcard2.jpg'
import { faceUpload } from '@/api/course'
import { updateIdCardImg } from '@/api/user'

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

      lesson_id: 0,
      end_second: 0,
      real_status: false,
      timer: 0,
      src: '',

      id_card_front: {},
      id_card_reverse: {},
      uploadOne: '',
      uploadTow: '',
      placeholderOne: placeholderOne,
      placeholderTwo: placeholderTwo,
      success: {
        'background-color': '#fff',
        'z-index': 'unset',
      },


      errMsgMap: {
        'AbortError': '终止',
        'NotReadableError': '拒绝',
        'NotFoundError': '找不到媒体类型',
        'NotReadableError': '无法读取',
        'OverconstrainedError': '无法满足要求',
        'OverconstrainedError': '安全',
        'TypeError': '类型'
      }
    }
  },
  onLoad(query) {
    let { lesson_id, end_second, real_status } = query
    this.lesson_id = +lesson_id
    this.end_time = +end_second
    this.real_status = +real_status

    this.init()
  },
  mounted() {
    if (!this.real_status) {
      this.mountedDom()
    }
  },
  onUnload() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    init() {
      if (window.strem) { this.stopStrem() }
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
      console.log('navigator.mediaDevices)', window.navigator.getUserMedia);
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
      let messageErr = `${this.errMsgMap[error.name]}错误`
      uni.showToast({ title: messageErr, icon: 'none' })
    },
    // 获取媒体
    geMediaDevices(constraints) {
      console.log('asdsa');
      let devicesState = this.devicesState
      if (devicesState === 'mediaDevices.getUserMedia') {
        navigator.mediaDevices.getUserMedia(constraints).then(this.handlerSuccess).catch(this.handlerError)
      } else {
        navigator[devicesState](constraints, this.handlerSuccess, this.handlerError)
      }
    },
    // 开始雅正
    handleOk() {
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
      // if (this.strem) this.stream.getTracks().forEach((track) => track.stop());
    },

    // 发送数据
    async sendData() {
      let params = this.getMediaData()
      let res = await faceUpload(params)
      if (res.code === 0) {
        this.verificationStatus = true
        this.btndisabled = true
        this.messageErr = '验证通过'
        this.stopStrem()
      } else {
        this.verificationStatus = false
        this.messageErr = res.message
        this.countError++;
        if (this.countError > 20) {
          this.btndisabled = false
          clearInterval(this.timer)
          this.timer = null
          this.messageErr = '人脸验证失败,请重新验证'
        }
      }
    },


    onUpload(index) {
      uni.chooseImage({
        count: 1,
        success: ({ tempFiles, tempFilePaths }) => {
          console.log(tempFiles, tempFilePaths);
          if (index === 1) {
            this.uploadOne = tempFiles[0].path
            this.id_card_front = tempFiles[0]
          } else {
            this.uploadTow = tempFiles[0].path
            this.id_card_reverse = tempFiles[0]
          }
        }
      })
    },
    blobToBase64() {

    },
    // 更新身份证照片
    async updateIdCardImg() {
      let id_card_front = this.id_card_front
      let id_card_reverse = this.id_card_reverse
      if (!id_card_front.name) return uni.showToast({ title: '上传身份证人面像', icon: 'none' });
      if (!id_card_reverse.name) return uni.showToast({ title: '上传身份证国徽面', icon: 'none' });

      let params = { id_card_front: this.id_card_front, id_card_reverse: this.id_card_reverse }
      let res = await updateIdCardImg(params)
      if (res.code === 0) {
        this.real_status = true
      }
    }
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

.real {
  padding: 30rpx;

  .title {
    width: 100%;
    color: #050505;
    font-size: 28rpx;
    text-align: left;
  }

  .img-box {
    position: relative;
    padding: 30rpx 10rpx;
    width: calc(100% - 20rpx);
    margin-top: 30rpx;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);

    .img {
      width: 600rpx;
      height: 400rpx;
      z-index: -1;
    }

    .upload-status {
      position: absolute;
      top: 150rpx;
      left: 200rpx;
      width: 300rpx;
      display: flex;
      flex-direction: column;
      align-items: center;

      .upload-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 68rpx;
        height: 68rpx;
        border-radius: 50%;
        background-color: #199fff;
      }

      .text {
        font-size: 32rpx;
        color: #fff;
      }
    }
  }

  .bottom {
    margin-top: 180rpx;
    font-size: 24rpx;
    color: #888888;
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