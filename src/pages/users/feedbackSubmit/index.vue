<template>
  <view class="feedback-submit">
    <custom-header :title="defaultTitle"></custom-header>

    <form @submit="onSubmit" @reset="onReset" class="form">
      <view class="form-item">
        <view class="title">请选择建议类型</view>
        <uni-data-select v-model="form.type" :localdata="types"></uni-data-select>
      </view>
      <view class="form-item">
        <view class="title">填写反馈内容</view>
        <view class="form-control">
          <textarea v-model="form.content" :maxlength="200" show-confirm-bar placeholder="请输入反馈内容" />
        </view>
      </view>
      <view class="form-item">
        <view class="title">截图( {{ form.images.length }} /3)</view>
        <view class="form-control">
          <uni-file-picker :limit="3" fileMediatype="image" mode="grid" @select="select" @delete="ondel" />
        </view>
      </view>

      <view class="footer">
        <button class="footer-btn" type="primary" form-type="submit">我要反馈</button>
      </view>
    </form>
  </view>
</template>

<script>
import { feedback, uploadImage } from "@/api/user"
import CustomHeader from "@/components/custom-header"

export default {
  components: {
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '意见反馈',
      types: [
        { text: '课程建议', value: 1 },
        { text: '功能建议', value: 2 },
        { text: '程序错误', value: 3 },
        { text: '其他问题', value: 4 },
      ],
      candidates: ['课程建议', '功能建议', '程序错误', '其他问题'],
      form: {
        type: '',
        content: '',
        images: []
      },
    }
  },
  methods: {
    async select({ tempFiles }) {
      let file = tempFiles[0]
      let token = this.$store.getters.token
      let org = this.$store.getters.orgInfo
      let header = { 'token': token, 'org-id': org.id }
      let ret = await uploadImage(file.file, header)
      let res = JSON.parse(ret[1].data)
      if (res.code === 0) {
        let item = { id: file.uuid, url: res.data }
        this.form.images.push(item)
      }
    },
    ondel({ tempFile }) {
      console.log('tempFiles', tempFile);
      let file = tempFile
      let index = this.form.images.findIndex(item => item.id === file.uuid)
      this.form.images.splice(index, 1)
    },
    async onSubmit(e) {
      let form = this.form
      form.images = form.images.map(item => (item.url))
      let params = { ...form }
      let res = await feedback(params)
      if (res.code === 0) {
        this.onReset()
        uni.showToast({ title: '提交成功', icon: 'success' })
        setTimeout(() => { this.goBack() }, 800)
      } else {
        uni.showToast({ title: `${res.message}`, icon: 'none' })
      }
    },
    onReset() {
      this.form = { type: '', content: '', images: [] }
    },
    goBack() {
      let pages = getCurrentPages()
      if (pages.length > 1) {
        uni.navigateBack({ delta: 1 })
      } else {
        history.back()
      }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.feedback-submit {
  overflow: hidden;
  width: 100%;
}

.form-item {
  margin-top: 30rpx;
  padding: 20rpx 40rpx;
}

.title {
  font-size: $font-size-base;
  font-weight: bold;
  line-height: calc(3 * $font-size-base);
  color: $text-color;
}

.form-control {
  border: $logan-border-spacing-md-sm;
}

.footer {
  text-align: center;
  margin-top: 128rpx;

  &-btn {
    width: 80%;
    border-radius: 48rpx;
  }
}
</style>