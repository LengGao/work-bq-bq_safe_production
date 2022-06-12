<template>
  <view class="about-us">
    <custom-header :title="defaultTitle"></custom-header>
    <uParse :content="content || '--'"></uParse>
  </view>
</template>

<script>
import CustomHeader from "@/components/custom-header"
import { aboutUs } from "@/api/user"

export default {
  components: {
    CustomHeader,
  },
  data() {
    return {
      defaultTitle: '关于我们',
      content: ''
    }
  },
  onLoad() {
    this.aboutUs()
  },
  methods: {
    async aboutUs() {
      let res = await aboutUs()
      if (res.code === 0) {
        this.content = res.data
      }
    }
  }

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.about-us {
  overflow: hidden;
  padding: 40rpx;
  height: 100%;
}

.none {
  padding: 50% 50%;
}
</style>