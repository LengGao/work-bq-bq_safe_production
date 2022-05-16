export default {
  data() {
    return {
      isLogin: false
    }
  },
  created() {
    let userInfo = uni.getStorageSync('userInfo')
    if (!userInfo.token) {
      // #ifdef H5
      uni.redirectTo({ url: '/pages/indexs/login/index' })
      // #endif
      // #ifdef MP-WEIXIN
      uni.redirectTo({ url: '/pages/indexs/loginAuth/index' })
      // #endif
    } else {
      this.isLogin = true
    }
  }
}