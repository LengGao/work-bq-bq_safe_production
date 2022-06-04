<template>
  <view class="feedback-submit">
    <form @submit="onSubmit" @reset="onReset">
      <view class="form-item">
        <view class="title">请选择建议类型</view>
        <uni-combox v-model="form.type" :candidates="types" placeholder="请选择建议类型"></uni-combox>
      </view>

      <view class="form-item">
        <view class="title">填写反馈内容</view>
        <view class="form-control">
          <textarea @confirm="onConfirm" :value="form.remark" :maxlength="200" show-confirm-bar
                    placeholder="请输入问题的正问内容">
        </textarea>
        </view>
      </view>

      <view class="form-item">
        <view class="title">截图( {{ form.fileList.length }} /3)</view>
        <view class="form-control">
          <uni-file-picker v-model="form.fileList" fileMediatype="image" mode="grid" @select="select"
                           @progress="progress" @success="success" @fail="fail" />
        </view>
      </view>

      <view class="footer">
        <button @click="onCLick" class="footer-btn" type="primary" form-type="submit">我要反馈</button>
      </view>
    </form>
  </view>

</template>

<script>
import { feedback } from "@/api/user"

export default {
  data() {
    return {
      types: ['类型1', '类型2', '类型3'],
      form: {
        type: '',
        remark: '',
        fileList: []
      },
      value: '',
      indicatorStyle: `height: 50px;`
    }
  },
  methods: {
    onCLick() {

    },
    onPicker() {

    },
    onNodeClick() {

    },
    onConfirm(e) {
      this.form.remark = e.detail.value
    },
    select() {
    },
    progress() {
    },
    success() {
    },
    fail() {
    },
    onSubmit(e) {
      console.log(e);

      this.onReset()
      uni.navigateBack()
    },
    onReset() {
      this.form = { type: '', remark: '', fileList: [] }
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.feedback-submit {
  padding: 20rpx 40rpx;
  overflow: hidden;
}

.form-item {
  margin-top: 30rpx;
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