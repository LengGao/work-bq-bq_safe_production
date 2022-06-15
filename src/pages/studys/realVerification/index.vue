<template>
  <view class="real-verification">
    <custom-header :title="defaultTitle"></custom-header>
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
            <view class="text">上传身份证人面像!</view>
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
            <view class="text">上传身份证人面像!</view>
          </view>
        </view>
      </view>

      <view class="bottom">
        注：根据安全生产资格考试网络培训管理办法规定， 此 课程需要通过实名认证后才能开始学习。
      </view>

      <view class="dialog-footer">
        <button class="btn-primary" @click="updateIdCardImg">人脸识别</button>
      </view>
    </view>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import placeholderOne from '@/pages/studys/static/idcard1.jpg'
import placeholderTwo from '@/pages/studys/static/idcard2.jpg'
import { updateIdCardImg, uploadFile } from '@/api/user'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '人脸认证',
      course_id: 0,
      lesson_id: 0,
      end_second: 0,
      real_status: false,
      timer: 0,
      src: '',

      uploadOne: '',
      uploadTow: '',
      id_card_front: '',
      id_card_frontFile: {},
      id_card_reverse: '',
      id_card_reverse_reverseFile: {},
      placeholderOne: placeholderOne,
      placeholderTwo: placeholderTwo,
    }
  },
  onLoad(query) {
    let { lesson_id, end_second, course_id } = query
    this.course_id = +course_id
    this.lesson_id = +lesson_id
    this.end_second = +end_second
  },
  methods: {
    onUpload(index) {
      uni.chooseImage({
        count: 1,
        success: ({ tempFiles, tempFilePaths }) => {
          console.log(tempFiles, tempFilePaths);
          if (index === 1) {
            let file = tempFiles[0]
            let path = file.path
            console.log('file',file);
            this.uploadOne = path
            this.id_card_front = file.name.replaceAll('.', '_')
            this.id_card_frontFile = file
          } else {
            let file = tempFiles[0]
            let path = file.path
            console.log('file',file);
            this.uploadTow = path
            this.id_card_reverse = file.name.replaceAll('.', '_')
            this.id_card_reverseFile = file
          }
        }
      })
    },
    faceVerification() {
      let course_id = this.course_id
      let lesson_id = this.lesson_id
      let end_second = this.end_second
      let url = `/pages/studys/faceVerification/index`
      let query = `?course_id=${course_id}&lesson_id=${lesson_id}&end_second=${end_second}`
      uni.redirectTo({ url: url + query })
    },
    // 更新身份证照片
    async updateIdCardImg() {
      let id_card_front = this.id_card_front
      let id_card_reverse = this.id_card_reverse
      if (!id_card_front) return uni.showToast({ title: '上传身份证人面像', icon: 'none' });
      if (!id_card_reverse) return uni.showToast({ title: '上传身份证国徽面', icon: 'none' });
      let token = this.$store.getters.token
      let org = this.$store.getters.orgInfo
      let header = {'token': token, 'org-id': org.id}
      let formData = { id_card_front, id_card_reverse }
      let files = [this.id_card_frontFile, this.id_card_reverseFile]
      let res = await uploadFile(files, header, formData)
      if (res.code === 0) {
        uni.showToast({ title: '实名认证通过', icon: 'none' })
        this.faceVerification()
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
    margin-top: 180rpx;
    font-size: 24rpx;
    color: #888888;
  }
}

.dialog-footer {
  margin-top: 100rpx;
  width: 100%;

  .btn-primary {
    color: #fff;
    font-size: 32rpx;
    background-color: #199fff;
    border-radius: 22rpx;
  }
}
</style>