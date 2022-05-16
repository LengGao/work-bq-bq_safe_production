export default {
  data() {
    return {
      isLogin: false
    }
  },
  mounted() {
    let userInfo = uni.getStorageSync('userInfo')
    if (!userInfo.token) {
      // #ifdef H5
      uni.redirectTo({ url: '/pages/indexs/login/index' })
      // #endif
      // #ifdef MP-WEIXIN
      uni.redirectTo({ url: '/pages/indexs/loginAuth/index' })
      // #endif
    // } else if (!userInfo.mobile) {
    //   // #ifdef H5
    //   uni.redirectTo({ url: '/pages/indexs/login/index?type=1' })
    //   // #endif
    //   // #ifdef MP-WEIXIN
    //   uni.redirectTo({ url: '/pages/indexs/loginAuth/index?type=1' })
    //   // #endif
    } else {
      this.isLogin = true
    }
  }
}