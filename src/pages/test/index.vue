<template>
  <view class="test">
    <view class="my-picker">
      <uni-file-picker v-model="imageValue" fileMediatype="image" mode="grid" @select="select" @progress="progress"
                       @success="success" @fail="fail" />
    </view>
    <button hover-class="button-hover" @click="saveFile">
      点击下载
    </button>

  </view>
</template>

<script>
import mescrollBody from '../../uni_modules/mescroll-uni/components/mescroll-body/mescroll-body.vue';
import { login } from '@/api/user'

export default {
  components: { mescrollBody },
  data() {
    return {
      imageValue: [],
      data: [
        { id: 1, name: 'a' },
        { id: 2, name: 'a' },
        { id: 3, name: 'a' },
        { id: 4, name: 'a' },
        { id: 5, name: 'a' },
        { id: 6, name: 'a' },
        { id: 7, name: 'a' },
        { id: 8, name: 'a' },
        { id: 9, name: 'a' },
        { id: 10, name: 'a' },
      ],
      down: {}
    };
  },
  methods: {
    downFn(e) {
      console.log('d', e);
    },
    onchange(e) {
      const value = e.detail.value
    },
    onnodeclick(node) {
    },
    bindPickerChange() {

    },
    // 获取上传状态
    select(e) {
      console.log('选择文件：', e)
    },
    // 获取上传进度
    progress(e) {
      console.log('上传进度：', e)
    },

    // 上传成功
    success(e) {
      console.log('上传成功')
    },

    // 上传失败
    fail(e) {
      console.log('上传失败：', e)
    },

    saveFile() {
      let data = { page: 1, limit: 10 }
      login(data)
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
</style>