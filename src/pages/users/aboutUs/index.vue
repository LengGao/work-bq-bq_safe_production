<template>
<view class="about-us">
  <uParse  :content="content || '--'" ></uParse>
</view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { browser } from '@/mixins/index'
import { aboutUs } from "@/api/user"
export default {
  mixins: [browser],
  components: {
    uParse
  },
  data() {
    return {
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