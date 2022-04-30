<template>
<view class="contact-service">
  <view class="box">
    <view>若有疑问请及时与我们联系</view>
    <view>工作事件: 8.30-24.00</view>
    <image
      class="box-img"
      src="/static/logo.png"
      mode="aspectFit"
      show-menu-by-longpress
      fade-show
    />
    <view>长按扫码添加客服微信</view>
    
  </view>

</view>
  
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
.contact-service {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.box {
  margin-top: 25vh;
  font-size: $font-size-base;
  text-align: center;
}

.box-img {
  width: 240rpx;
  height: 300rpx;
}


</style>