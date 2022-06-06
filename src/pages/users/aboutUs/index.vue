<template>
<view class="about-us">
  <uParse  :content="content || '--'" ></uParse>
</view>
</template>

<script>
import uParse from "@/components/gaoyia-parse/parse.vue";
import { aboutUs } from "@/api/user"
export default {
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
  width: 100%;
  height: 100%;
}

.none {
  padding: 50% 50%;
}

</style>