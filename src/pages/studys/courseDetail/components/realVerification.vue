<template>
  <view class="real-verification">
    <view class="nav-bar">    
      <uni-icons class="nav-bar-back" type="back" color="#fff" size="16px" @click="goBack" />
      <slot name="title"><text class="nav-bar-title"> {{ defaultTitle }} </text></slot>
    </view>

    <view class="real">
      <view class="title">上传证件照</view>
      <view class="img-box" @click="() => onUpload(1)">
        <image class="img" :src="uploadOne || placeholderOne" mode="aspectFill" />

        <view class="icon-box">
          <view class="upload-icon" v-if="uploadOne">
            <view class="success-icon">
            <uni-icons customPrefix="iconfont" type="icon-zhengquetishitianchong" size="72rpx" color="#3EC100" />
            </view>
            <view class="text">上传成功!</view>
          </view>

          <view class="upload-icon" v-else>
            <view class="none-icon">
            <uni-icons customPrefix="iconfont" type="icon-shangchuan-copy" size="48rpx" color="#fff" />
            </view>
            <view class="text">上传身份证人像面!</view>
          </view>
        </view>
      </view>

      <view class="img-box" @click="() => onUpload(2)">
        <image class="img" :src="uploadTow || placeholderTwo" mode="aspectFill" />

        <view class="icon-box">
          <view class="upload-icon" v-if="uploadTow">
            <view class="success-icon">
            <uni-icons customPrefix="iconfont" type="icon-zhengquetishitianchong" size="72rpx" color="#3EC100" />
            </view>
            <view class="text">上传成功!</view>
          </view>

          <view class="upload-icon" v-else>
            <view class="none-icon">
            <uni-icons customPrefix="iconfont" type="icon-shangchuan-copy" size="48rpx" color="#fff" />
            </view>
            <view class="text">上传身份证国徽面!</view>
          </view>
        </view>
      </view>

      <view class="bottom">
        注：根据安全生产资格考试网络培训管理办法规定， 此 课程需要通过实名认证后才能开始学习。
      </view>

      <view class="dialog-footer">
        <button class="btn-primary" @click="updateIdCardImg">实名认证</button>
      </view>
    </view>
  </view>
</template>

<script>
import placeholderOne from '@/pages/studys/static/idcard1.jpg'
import placeholderTwo from '@/pages/studys/static/idcard2.jpg'
import { updateIdCardImg } from '@/api/user'

export default {
  name: 'RealVerification',
  data() {
    return {
      defaultTitle: '实名认证',
      timer: 0,
      verificationStatus: false,

      uploadOne: '',
      uploadTow: '',
      id_card_front: '',
      id_card_reverse: '',
      placeholderOne: placeholderOne,
      placeholderTwo: placeholderTwo,

      canvas: null,
    }
  },
  created() {
    if (this.canvas) {
      this.canvas = null
    }
  },
  methods: {
    goBack() {
      this.$emit('RealVerifitynSuccess', this.verificationStatus)
    },

    onUpload(index) {
      uni.chooseImage({
        count: 1,
        sizeType: ['original'],
        success: ({ tempFilePaths, tempFiles }) => {
          if (index === 1) {
            this.uploadOne = tempFilePaths[0]
            this.blobToBase64(index, tempFilePaths[0])
          } else {
            this.uploadTow = tempFilePaths[0]
            this.blobToBase64(index, tempFilePaths[0])
          }
        }
      })
    },

    blobToBase64(blob) {
      let canvas = this.canvas
      if (!canvas) {
        canvas = document.createElement('canvas') 
        canvas.width = 600
        canvas.height = 400
        this.canvas = canvas
      }
      let image = new Image()
      let context = canvas.getContext('2d')
      return new Promise((resolve, reject) => {
        image.onload = function () {
          image.width = 600
          image.height = 400
          context.drawImage(image, 0, 0, image.width, image.height)
          let dataURLs = canvas.toDataURL('image/png')
          resolve(dataURLs.split(';base64,')[1])
        }
        image.mode = 'aspectFill'
        image.src = blob
      })
    },

    // 更新身份证照片
    async updateIdCardImg() {
      let uploadOne = this.uploadOne
      let uploadTow = this.uploadTow
      if (!uploadOne) return uni.showToast({ title: '上传身份证人面像', icon: 'none' });
      if (!uploadTow) return uni.showToast({ title: '上传身份证国徽面', icon: 'none' });

      let res = await Promise.all([this.blobToBase64(uploadOne), this.blobToBase64(uploadTow)])
      if (res.length) {
        this.sendData(res[0], res[1])
      }
    },

    async sendData(id_card_front, id_card_reverse) {
      let params = { id_card_front, id_card_reverse }
      let res = await updateIdCardImg(params)
      if (res.code === 0) {
        this.verificationStatus = true
        uni.showToast({ title: '实名认证通过', icon: 'none' })
      this.goBack()
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.real-verification {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
}

.nav-bar {
  display: flex;
  height: 44px; // 固定值
  font-size: 16px;
  line-height: 44px;
  color: #fff;
  padding-left: 10px;
  background-color: #199fff;

  &-back {
    z-index: 99;
  }

  &-title {
    flex: 1;
    margin-left: -26px;
    text-align: center;
    z-index: 90;
  }
}

.real {
  position: relative;
  padding: 30rpx 30rpx 0;

  .title {
    width: 100%;
    color: #050505;
    font-size: 28rpx;
    text-align: left;
  }

  .img-box {
    position: relative;
    padding: 30rpx 10rpx;
    margin-top: 30rpx;
    text-align: center;
    background-color: rgba(0, 0, 0, 0.4);

    .img {
      width: 600rpx;
      height: 400rpx;
      z-index: -1;
    }
    
    .icon-box {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;

      .upload-icon {
        display: flex;
        flex-direction: column;
        align-items: center;

        .success-icon {
          height: 62rpx; 
          width: 62rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%; 
          background-color: #fff; 
        }

        .none-icon {
          height: 68rpx; 
          width: 68rpx;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 50%; 
          background-color: #199fff; 
        }

        .text {
          margin-top: 20rpx;
          width: 100%;
          font-size: 32rpx;
          color: #fff;
        }
      }
    }
  }

  .bottom {
    margin-top: 80rpx;
    font-size: 24rpx;
    color: #888888;
  }
}

.dialog-footer {
  position: fixed;
  bottom: calc(40rpx + var(--window-bottom));
  left: 10%;
  width: 80%;

  .btn-primary {
    color: #fff;
    font-size: 32rpx;
    background-color: #199fff;
    border-radius: 22rpx;
  }
}
</style>