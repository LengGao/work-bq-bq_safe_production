<template>
  <view class="login">
    <view class="form">
      <image src="@/static/logo.png" class="header-logo" mode="aspectFit" />
      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-user-filling" size="36rpx" color="#ccc"
                   style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="username" placeholder="请输入手机号码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="number" :inputBorder="false">
        </uni-easyinput>
      </view>
      <view class="input-box">
        <uni-icons customPrefix="iconfont" type="icon-mima" size="36rpx" color="#ccc" style="margin-left: 10rpx" />
        <uni-easyinput class="input" v-model="password" placeholder="请输入登录密码" @focus="onFocus" @blur="onBlur"
                       placeholderStyle="font-size: 28rpx; color: #ccc;" type="password" :inputBorder="false"
                       passwordIcon></uni-easyinput>
      </view>
      <button class="btn-submit" :class="!isRead ? 'btn-disable' : ''" :disable="!isRead" @click="onSubmit">登录</button>
      <view class="read">
        <checkbox-group  @change="onChecked" >
          <label class="label">
            <checkbox class="checkbox" value="1" :checked="isRead" />
            我已阅读并同意<text class="label-em" @click="onRead">《用户协议与隐私政策》</text>
          </label>
        </checkbox-group>
      </view>
    </view>

    <view class="footer" :style="visibility ? 'visibility: hidden;' : 'visibility: visible;'">
      <text @click="onForgine"> 忘记密码</text>
      <text class="bdi">|</text>
      <text @click="regsoter">注册账号</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      isRead: false,
      visibility: false
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
  methods: {
    onSubmit() {
      let parent = { username: this.username, password: this.password }
    },
    onChecked(e) {
      this.isRead = e.target.value.length ? true :false
    },
    onFocus() {
      this.visibility = true
    },
    onBlur() {
      this.visibility = false
    },
    updateRead(isRead) {
      this.isRead = isRead
    },
    onRead() {
      uni.navigateTo({ url: '/pages/indexs/clause/index' })
    }, 
    onForgine() {
      uni.navigateTo({ url: '/pages/indexs/forget/index'})
    },
    regsoter() {
      uni.navigateTo({ url: '/pages/indexs/reisgter/index' })
    },
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";

.login {
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
    height: 72rpx;
    line-height: 72rpx;
    border: 2rpx solid #eee;
  }

  .input-box:nth-of-type(2) {
    margin-top: 40rpx;
  }

  .read {
    display: flex;
    flex-direction: row;
    align-items: center;

    .checkbox {
      margin-right: 10rpx;
      transform: scale(0.7);
    }

    .label {
      color: #999;
    }

    .label-em {
      color: $color-primary;
    }
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
  
  .bdi {
    margin:  0 40rpx;
  }
}
</style>