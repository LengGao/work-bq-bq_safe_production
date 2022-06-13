<template>
  <view class="user">
    <custom-header :title="defaultTitle" :needBack="false"></custom-header>

    <view class="user-header">
      <view class="user-card">
        <UserInfo :info="userInfo" :orgInfo="orgInfo" :isLogin="isLogin" @login="login" />
        <view class="card-setting">
          <uni-icons v-if="isLogin" customPrefix="iconfont" type="icon-tuichu" color="#fff" size="40rpx"
                     class="card-setting-icon" @click="loginlout" />
        </view>
      </view>
    </view>

    <view class="grids">
      <uni-grid :column="3" :showBorder="false" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" >
          <view class="grid-item" @click="() => onClickGrid(grid.url, grid.blank)">
            <image :src="grid.thumb" class="grid-image" mode="aspectFit" />
            <text class="grid-text">{{ grid.title }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="links" :style="{'margin-top': linksMargin}">
      <uni-list class="list" >
        <uni-list-item v-for="link in links" :key="link.id" :to="link.url" :title="link.title" showExtraIcon showArrow
                       clickable :extraIcon="link.showExtraIcon" @click="onClickList(link.id)">
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import UserInfo from "./components/userInfo";
import CustomHeader from "@/components/custom-header"
import { browser } from '@/mixins/index'
import { mapGetters } from 'vuex'

export default {
  mixins: [browser],
  components: {
    UserInfo,
    CustomHeader
  },
  data() {
    return {
      defaultTitle: '个人中心',
      loading: false,
      gridIndex: 0,
      grids: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird1.png", title: "我的课程", url: "/pages/users/userCourceList/index", blank: 'navigateTo' },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird2.png", title: "我的题库", url: "/pages/examination/index", blank: 'switchTab' },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird3.png", title: "我的班级", url: "/pages/users/userClassList/index", blank: 'navigateTo' },
      ],
      listIndex: 0,
      links: [
        { id: 1, showExtraIcon: { customPrefix: 'iconfont', color: '#1296db', size: '60rpx', type: 'icon-shoucang3' }, title: "课程收藏", url: "/pages/users/userCollectCource/index" },
        { id: 2, showExtraIcon: { customPrefix: 'iconfont', color: '#1296db', size: '60rpx', type: 'icon-guanyuwomen-2' }, title: "关于我们", url: "/pages/users/aboutUs/index" },
        { id: 3, showExtraIcon: { customPrefix: 'iconfont', color: '#1296db', size: '60rpx', type: 'icon-Opinion' }, title: "意见反馈", url: "/pages/users/feedback/index" },
        { id: 4, showExtraIcon: { customPrefix: 'iconfont', color: '#1296db', size: '60rpx', type: 'icon-lianxikefu' }, title: "联系客服", url: "/pages/users/contactService/index" },
      ],
      isLogin: false,

      linksMargin: '100rpx'
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'orgInfo'])
  },
  onLoad() {
  },
  mounted() {
    if (this.isWeixinJSBridge) {
      this.linksMargin = '200rpx'
    }
  },
  onShow() {
    if (this.userInfo.token) {
      this.isLogin = true
    } else {
      this.isLogin = false
    }
  },
  methods: {
    onClickList(detail) {
      console.log("listIndex", detail);
      this.listIndex = detail;
    },
    onClickGrid(url, blank) {
      if (blank === 'switchTab') {
        uni.switchTab({ url: url })
      } else {
        uni.navigateTo({ url: url })
      }
    },
    login() {
      uni.navigateTo({ url: '/pages/login/index' })
    },
    async loginlout() {
      if (!this.isLogin) return false;
      let modal = await uni.showModal({ title: '提示', content: '确定要退出登录吗' })
      if (!modal[1].confirm) return;
      let res = await this.$store.dispatch('loginout')
      if (res.code === 0) {
        uni.showToast({ title: '退出成功', icon: 'success' })
      }
      /* #ifdef H5 */
      location.reload()
      /* #endif */
      /* #ifdef MP-WEIXIN */
      this.onLoad()
      /* #endif */
    }
  },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$page-padding: 0rpx 20rpx;

.user {
  width: 100%;
}

.user-header {
  height: 330rpx;
  margin-top: -2rpx;
  width: 100%;
  background-image: url("/static/img/user_bg_head.png");
  background-size: 100% 100%;
  background-repeat: no-repeat;
}

.user-card {
  display: flex;
  flex-direction: row;
  align-content: space-between;
  align-items: center;
  height: 54%;
  padding: $page-padding;

  .card-setting {
    position: relative;
    top: -30rpx;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 20rpx;
    text-align: right;
  }
}

.grids {
  position: absolute;
  top: 268rpx;
  margin: 0 40rpx;
  width: calc(100% - 80rpx);
  height: 190rpx;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 24rpx;
  box-shadow: 0rpx 0rpx 12rpx rgb(129, 202, 255, 0.75);
}

.grid {
  width: 100%;

  &-item {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 190rpx;
  }

  &-image {
    width: $img-size-grid;
    height: $img-size-grid;
    border-radius: 10rpx;
  }

  &-text {
    margin-top: 20rpx;
    font-size: $font-size-base;
  }
}

::v-deep .uni-list-item__container {
  align-items: center;
}

::v-deep .uni-list-item__content-title {
  font-size: $font-size-base;
}

.list {
  font-size: $font-size-base;

  &-image {
    width: 60rpx;
    height: 60rpx;
    border-radius: $border-radius-circle;
    margin-right: 16rpx;
  }
}

.btn-loginout {
  margin-top: 30rpx;
  color: $color-error;
  background-color: transparent;
}
</style>