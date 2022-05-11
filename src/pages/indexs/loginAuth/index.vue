<template>
  <view class="login-auth">

    <button class="btn" :loading="loading" @click="getUserInfo" :disabled="!active" type="primary">
      授权登录
    </button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      form: {}
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.login-auth {
  text-align: center;
}

</style>