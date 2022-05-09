<template>
  <view class="reisgter">
    <view class="form">
      <image src="@/static/logo.png" class="header-logo" mode="aspectFit" />
      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-user-filling" size="36rpx" color="#ccc"
                   style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="username" placeholder="请输入您的姓名" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="number" :inputBorder="false">
        </uni-easyinput>
      </view>

      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-shouji" size="36rpx" color="#ccc"
                   style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="phone" placeholder="请输入手机号码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="number" :inputBorder="false">
        </uni-easyinput>
      </view>

      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-xiaoxi6" size="36rpx" color="#ccc"
                   style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="verifCode" placeholder="请输入短信验证码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="number" :inputBorder="false">
        </uni-easyinput>
        <view class="verif-code">
          <text class="verif-code-text" v-if="!timeOut" @click="onClickVerif">发送验证码</text>
          <text class="time-out" v-else>重新发送 {{ timeCount }}</text>
        </view>
      </view>

      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-mima" size="36rpx" color="#ccc" style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="password" placeholder="请设置6至20位密码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="password" :inputBorder="false"
                       passwordIcon></uni-easyinput>
      </view>

      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-mima" size="36rpx" color="#ccc" style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="passwordRepeat" placeholder="请再次确认密码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="password" :inputBorder="false"
                       passwordIcon></uni-easyinput>
      </view>

      <button class="btn-submit" @click="onSubmit">注册</button>
    </view>

    <view class="footer" :style="visibility ? 'visibility: hidden;' : 'visibility: visible;'">
      <text> 已有账号？</text>
      <text class="go-login" @click="goLogin">点此登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      phone: '',
      verifCode: '',
      password: '',
      passwordRepeat: '',
      isRead: false,
      visibility: false,
      timeCount: 60,
      timeOut: null
    }
  },
  updated() {
    uni.onKeyboardHeightChange(res => {
      console.log("onKeyboardHeightChange", res.height)
      if (res.height) {
        this.visibility = false
      }
    })
  },
  destroyed() {
    clearTimeout(this.timeOut)
    this.timeCount = 60
  },
  methods: {
    onSubmit() {
      let { username, phone, verifCode, password, passwordRepeat } = this
      let param = { username, phone, verifCode, password, passwordRepeat }
      if (this.validator(param) ) {
        // send request
      }
    },
    validator(param) {
      if (!/^1[3,4,5,7,8,9]\d{9}$/.test(param.phone)) {
        uni.showToast({ icon: 'error', title: '请输入有效手机号码' }) 
        return false
      } else if (!param.verifCode) {
        uni.showToast({ icon: 'error', title: '请输入验证码' }) 
        return false
      } else if (param.password !== param.passwordRepeat) {
        uni.showToast({ icon: 'error', title: '两次密码不一致，请重新输入' })
        return false
      } else {
        return true
      }
    },
    onChecked(e) {
      this.isRead = e.target.value.length ? true :false
    },
    onClickVerif() {
      this.timeOut = setInterval(() => {
        this.timeCount = this.timeCount 
          ? this.timeCount - 1
          : 60 && (this.timeOut = null)
      }, 1000)
    },
    onFocus() {
      this.visibility = true
    },
    onBlur() {
      this.visibility = false
    },
    goLogin() {
        uni.navigateTo({ url: '/pages/indexs/login/index'})
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.reisgter {
  overflow: hidden;
  width: 100%;
  height: 100%;
}

.form {
  margin-top: 25%;
  padding: 0 60rpx;
  text-align: center;

  .header-logo {
    width: 400rpx;
    height: 200rpx;
  }

  .input-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 40rpx;
    height: 72rpx;
    line-height: 72rpx;
    border: 2rpx solid #eee;
  }

  .input-box:nth-of-type(1) {
    margin-top: 0;
  }

  .verif-code {
    font-size: $font-size-sm;
    margin-right: 10rpx;
  }

  .verif-code-text {
    color: $color-primary;
  }

  .time-out {
    color: #ccc;
  }

  .btn-submit {
    margin: 40rpx auto;
    color: #fff;
    border-radius: 12rpx;
    background-color: $color-primary;
    opacity: 0.9;
  }

  .btn-disable {
    opacity: 0.3;
  }
}

.footer {
  position: absolute;
  bottom: calc(20px + constant(safe-area-inset-botto));
  bottom: calc(20px + env(safe-area-inset-bottom));
  width: 100%;
  text-align: center;
  color: #999;
  
  .go-login {
    color:  $color-primary;
  }
}
</style>