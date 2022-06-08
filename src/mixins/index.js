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
      } else {
        this.isWeixinJSBridge = false
      }
      this.isMiniapp = false
    } else {
      this.isMiniapp = true
    }
  }
}

export const userStatus = {
  data() {
    return {
      userStatus: 0,
      courseStatus: 0,
      questionBlankStatus: 0,
    }
  },
  mounted() {
  },
  methods: {
    authority() {
      let userStatus = this.$store.getters.userStatus
      let questionBlankStatus = this.$store.getters.questionBankInfo.id
      console.log('questionBlankStatus',userStatus, questionBlankStatus);
      let res = true
      if (userStatus == 0 || userStatus == 1000 || userStatus == 1008) {
        res = false
        uni.showToast({ title: '请登录', icon: 'none' })
      } else if (!questionBlankStatus) {
        res = false
        uni.showToast({ title: '请选择题库', icon: 'none' })
      }
      return res
    }
  }
}