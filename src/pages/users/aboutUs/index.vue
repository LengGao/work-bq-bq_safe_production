<template>
  <view class="about-us">
    <custom-header :title="defaultTitle"></custom-header>
      <view class="content">
        <view v-html="content || '--'"></view>
      </view>
  </view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse";
import CustomHeader from "@/components/custom-header"
import { aboutUs } from "@/api/user"

export default {
  components: {
    uParse,
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
  width: 100%;
  height: 100%;
  overflow: auto;
}

.content {
  padding: 30rpx;
  font-size: 28rpx;
  line-height: 2;
  text-indent: 2em;
}

::v-deep uni-image {
  margin-left: -2em;
}

</style>