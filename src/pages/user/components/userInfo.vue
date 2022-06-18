<template>
  <view class="user-userInfo" :class="customClass" :style="customStyle">
    <view class="avator">
      <image class="avator" :src="userInfo.avatar_url || Avator" mode="aspectFill" @click="() => previewImg(userInfo.avator)" />
    </view>
    <view class="infos" v-if="isLogin">
      <view class="user">
        <text class="name"> {{ userInfo.real_name || '--' }} </text>
      </view>
      <view v-if="orgInfo.name" class="days">所属机构：{{ orgInfo.name }}</view>
      <view v-else class="days">加入东培学堂 {{ userInfo.org_join_day }} 天</view>
    </view>

    <view v-else>
      <view class="nologin" @click="onLogin">
        未登录
      </view>
    </view>
  </view>
</template>

<script>
import Avator from "@/static/img/user_avator.png";

export default {
  props: {
    userInfo: { 
      type: Object, 
      default: () => ({})
    },
    orgInfo: {
      type: Object, 
      default: () => ({})
    },
    isLogin: {
      type: Boolean,
      default: false
    },
    customStyle: { default: '' },
    customClass: { default: '' },
  },
  data() {
    return {
      Avator
    }
  },
  methods: {
    // 图片预览
    previewImg(url) {
      uni.previewImage({ urls: [url] })
    },
    onLogin() {
      this.$emit('login')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$height: 100rpx;

.user-userInfo {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  flex: 1 1 1;
}

.avator {
  height: $height;
  width: $height;
  border-radius: 50%;
}

.infos {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  font-size: $font-size-base;
  height: $height;
  margin-left: 40rpx;
}

.user {
  width: 100%;
  overflow: hidden;
  color: $text-color-inverse;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name {
  font-size: 32rpx;
}

.phone {
  margin-left: 10rpx;
}

.days {
  color: $text-color-inverse;
}

.nologin {
  font-size: $font-size-md;
  height: $height;
  margin-left: 40rpx;
  color: $text-color-inverse;
}
</style>