<template>
  <view class="user">
    <view class="user-header">
      <view class="user-card">
        <UserInfo :info="userInfo" :orgInfo="organizationCurrent" :isLogin="isLogin" @login="login" />
        <view class="card-setting">
          <!-- <uni-icons customPrefix="iconfont" type="icon-xiaoxi" color="#fff" size="42rpx" /> -->
          <uni-icons v-if="isLogin" customPrefix="iconfont" type="icon-tuichu" color="#fff" size="40rpx" class="card-setting-icon"
                     @click="loginlout" />
        </view>
      </view>
    </view>

    <view class="grids">
      <uni-grid :column="3" :showBorder="false" class="grid">
        <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item" style="height: inherit;">
          <view class="grid-box" @click="() => onClickGrid(grid.url, grid.blank)">
            <image :src="grid.thumb" class="grid-image" mode="aspectFit" />
            <text class="grid-text">{{ grid.title }}</text>
          </view>
        </uni-grid-item>
      </uni-grid>
    </view>

    <view class="links">
      <uni-list class="list">
        <uni-list-item v-for="link in links" :key="link.id" :to="link.url" :title="link.title"
                       @click="onClickList(link.id)" showArrow clickable>
          <template v-slot:header>
            <image class="list-image" :src="link.thumb" mode="widthFix"></image>
          </template>
        </uni-list-item>
      </uni-list>
    </view>
  </view>
</template>

<script>
import UserInfo from "./components/userInfo";
import { mapGetters } from 'vuex'

export default {
  components: {
    UserInfo,
  },
  data() {
    return {
      loading: false,
      gridIndex: 0,
      grids: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird1.png", title: "我的课程", url: "/pages/users/userCourceList/index", blank: 'navigateTo' },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird2.png", title: "我的题库", url: "/pages/examination/index", blank: 'switchTab' },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird3.png", title: "我的班级", url: "/pages/users/userClassList/index", blank: 'navigateTo' },
      ],
      listIndex: 0,
      links: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list1.png", title: "关于我们", url: "/pages/users/aboutUs/index" },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list2.png", title: "意见反馈", url: "/pages/users/feedback/index" },
        { id: 4, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list4.png", title: "联系客服", url: "/pages/users/contactService/index" },
      ],
      isLogin: false,
    };
  },
  computed: {
    ...mapGetters(['userInfo', 'organizationCurrent'])
  },
  onLoad() {
    console.log('onLoad');    
    console.log(getCurrentPages());
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
      let modal = await uni.showModal({ title: '提示', content: '确定要推出登录吗' })
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
  height: 100%;
  overflow-y: auto;
}

.user-header {
  height: 330rpx;
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
  top: 190rpx;
  margin: 0 40rpx;
  width: calc(100% - 80rpx);
  height: 190rpx;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  border-radius: 24rpx;
  box-shadow: 0rpx 0rpx 12rpx rgb(129, 202, 255, 0.75);
}

::v-deep .uni-grid {
  height: inherit;
}

.grid {
  width: 100%;
  height: inherit;

  &-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 190rpx;
    // #ifdef H5
    height: 100%;
    // #endif
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

.links {
  margin-top: 100rpx;
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