<template>
  <view class="detail">
    <Nobtns v-if="info.teacher" :data="info" />
    <!-- <Btns :data="detail" /> -->
    <view class="course-rich">
      <u-parse v-if="content" class="content" :content="content" />
    </view>

    <view class="footer">
      <button class="footer-btn" @click="onClick">开始学习</button>
    </view>
  </view>
</template>

<script>
import Nobtns from './Nobtns'
import Btns from './Btns'
import uParse from "@/components/gaoyia-parse/parse.vue";

export default {
  components: {
    Nobtns,
    Btns,
    uParse
  },
  props: {
    info: {
      type: Object,
      default: () => ({})
    },
    content: {
      type: String,
      default: '<p><暂无介绍/p>'
    }
  },
  data() {
    return {
      value: 3,
    }
  },
  methods: {
    onClick() {
      this.$emit('start')
    }
  }
}
</script>

<style lang="scss" scoped>
.course-rich {
  margin-top: 30rpx;
  padding: 0 30rpx 30rpx;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.footer {
  position: fixed;
  bottom: constant(safe-area-inset-bottom);
  bottom: env(safe-area-inset-bottom);
  left: 0;
  width: 100%;

  &-btn {
    width: 80%;
    font-size: 12rpx;
    color: #fff;
    border-radius: 64rpx;
    background-color: #199fff;
  }
}
</style>