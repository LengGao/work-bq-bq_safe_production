export const browser = {
  data() {
    return {
      isWeixinJSBridge: false,
      isMiniapp: false,
    }
  },
  created() {
    if (navigator) {
      let browser = navigator.userAgent.toLowerCase()
      if (browser.indexOf('micromessenger') !== -1 ) {
        this.isWeixinJSBridge = true
      } else {
        this.isWeixinJSBridge = false
      }
      this.isMiniapp = false
    } else {
      this.isMiniapp = true
    }
  }
}