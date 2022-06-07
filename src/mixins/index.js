export const browser = {
  data() {
    return {
      isWeixinJSBridge: false,
      isMiniapp: false,
    }
  },
  beforeCreate() {
    if (navigator) {
      let browser = navigator.userAgent.toLowerCase()
      if (browser.indexOf('micromessenger') !== -1 ) {
        this.isWeixinJSBridge = true
        // let header = document.getElementsByTagName('uni-page-head')
        // let node = header[0]
        // node.style.display = 'none'
        // let parent = node.parentNode
        // parent.removeChild(node)
      } else {
        this.isWeixinJSBridge = false
      }
      this.isMiniapp = false
    } else {
      this.isMiniapp = true
    }
  }
}