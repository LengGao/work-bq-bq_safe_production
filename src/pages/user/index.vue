<template>
  <view class="user">
    <view class="user-header">
      <view class="user-card">
        <UserInfo :info="user" />
        <view class="card-setting">
          <uni-icons customPrefix="iconfont" type="icon-xiaoxi" color="#fff" size="42rpx" />
          <uni-icons customPrefix="iconfont" type="icon-shezhi1" color="#fff" size="42rpx" class="card-setting-icon" />
        </view>
      </view>
    </view>

    <view class="grids">
      <uni-grid :column="3" :showBorder="false" @change="onChangeGrid" class="grid">
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

    <view class="footer">
      <button @click="loginlout" class="btn-loginout" hover-class="button-hover">
        退出登录
      </button>
    </view>
  </view>
</template>

<script>
import UserInfo from "./components/userInfo";
import { loginout } from '@/api/user'

export default {
  components: {
    UserInfo,
  },
  data() {
    return {
      loading: false,
      user: {
        name: "周杰伦",
        phone: "156****9914",
        avator: "https://img2.baidu.com/it/u=1347252749,346830019&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
        days: 7
      },
      gridIndex: 0,
      // 宫格数据
      grids: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird1.png", title: "我的课程", url: "/pages/users/userCourceList/index", blank: 'navigateTo' },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird2.png", title: "我的题库", url: "/pages/examination/index", blank: 'switchTab' },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird3.png", title: "我的班级", url: "/pages/users/userClassList/index", blank: 'navigateTo' },
        // { id: 4, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_gird4.png", title: "我的问答", url: "" }
      ],
      listIndex: 0,
      links: [
        { id: 1, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list1.png", title: "课程收藏", url: "/pages/examinations/favorites/index" },
        { id: 2, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list2.png", title: "意见反馈", url: "/pages/users/feedback/index" },
        { id: 3, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list3.png", title: "关于我们", url: "/pages/users/aboutUs/index" },
        { id: 4, thumb: "https://safetysystem.oss-cn-guangzhou.aliyuncs.com/icon/user_icon_list4.png", title: "联系客服", url: "/pages/users/contactService/index" },
      ],
    };
  },
  methods: {
    onChangeGrid({ detail }) {
      console.log("gridIndex", this.gridIndex, detail);
    },
    onClickList(detail) {
      console.log("listIndex", detail);
      this.listIndex = detail;
    },
    onClickGrid(url, blank) {
      console.log(url);
      if (blank === 'switchTab') {
        uni.switchTab({ url: url })
      } else {
        uni.navigateTo({ url: url })
      }
    },
    async loginlout() {
      let modal = await uni.showModal({ title: '系统提示', content: '确定要推出登录吗' })
      if (!modal[1].confirm) return;
      let res = await this.$store.dispatch('loginout')
      if (res.code === 0) {
        uni.showToast({ title: '退出成功', icon: 'success' })
        // # ifdef H5
        uni.reLaunch({ url: '/pages/indexs/login/index' })
        // # endif

        // # ifdef MP-WEIXIN
        uni.reLaunch({ url: '/pages/indexs/loginAuth/index' })
        // # endif
      } else {
        uni.showToast({ title: '登出失败', icon: 'error' })
      }
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

    &-icon {
      margin-left: 40rpx;
    }
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
    // # ifdef H5
    height: 100%;
    // # endif
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