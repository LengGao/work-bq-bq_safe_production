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
    this.userStatus = this.$store.user.getters.userStatus
  },
  methods: {
    authority() {
      let userStatus = this.$store.user.getters.userStatus
      let questionBlankStatus = this.$store.user.getters.questionBankInfo.id
      let res = true
      if (!userStatus) {
        res = false
        uni.showToast({ title: '请登录', icon: 'none' })
      } else if (!questionBlankStatus) {
        uni.showToast({ title: '请选择题库', icon: 'none' })
        res = false
      }
      return res
    }
  }
}