<template>
  <view class="learn-report">
    <div class="learn-report-item">

    </div>
  </view>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  methods: {
    preiviewImg(url) {
      uni.previewImage({
        urls: [url]
      })
    },

  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.learn-report {
  &-item {
  }
}
</style>