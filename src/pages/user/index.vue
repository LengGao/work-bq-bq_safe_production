<template>
    <view class="user">
        <view class="user-header">
            <view class="user-card">
                <UserInfo :info="user" />
                <view class="card-setting">
                    <image src="/static/img/user_icon_msg.png" class="card-setting-icon" mode="scaleToFill" />
                    <image src="/static/img/user_icon_setting.png" class="card-setting-icon" mode="scaleToFill" />
                </view>
            </view>
        </view>

        <view class="grids">
            <uni-grid :column="4" :showBorder="false" @change="onChangeGrid" class="grid">
                <uni-grid-item v-for="grid in grids" :key="grid.id" :index="grid.id" class="grid-item">
                    <view class="grid-box">
                        <image :src="grid.thumb" class="grid-image" mode="widthFix" />
                        <text class="grid-text">{{ grid.title }}</text>
                    </view>
                </uni-grid-item>
            </uni-grid>
        </view>

        <view class="links">
            <uni-list class="list">
                <uni-list-item v-for="link in links" :key="link.id" :to="link.url" :title="link.title" @click="onClickList(link.id)" showArrow clickable>
                    <template v-slot:header>
                        <view class="list-box">
                            <image class="list-image" :src="link.thumb" mode="widthFix"></image>
                        </view>
                    </template>
                </uni-list-item>
            </uni-list>
        </view>

        <view class="footer">
            <button @click="loginlout" :loading="loading" class="btn-loginout" hover-class="button-hover">
                退出登录
            </button>
        </view>
    </view>
</template>

<script>
import UserInfo from "./components/userInfo";

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
                avator: "",
                days: 7
            },
            gridIndex: 0,
            // 宫格数据
            grids: [
                { id: 1, thumb: "/static/img/user_gird1.png", title: "我的课程", url: "" },
                { id: 2, thumb: "/static/img/user_gird2.png", title: "我的题库", url: "" },
                { id: 3, thumb: "/static/img/user_gird3.png", title: "我的班级", url: "" },
                { id: 4, thumb: "/static/img/user_gird4.png", title: "我的问答", url: "" }
            ],
            listIndex: 0,
            links: [
                { id: 1, thumb: "/static/img/user_icon_list1.png", title: "课程收藏", url: "" },
                { id: 2, thumb: "/static/img/user_icon_list2.png", title: "意见反馈", url: "" },
                { id: 3, thumb: "/static/img/user_icon_list3.png", title: "关于我们", url: "" },
                { id: 3, thumb: "/static/img/user_icon_list4.png", title: "关于我们", url: "" },
            ],
        };
    },
    methods: {
        onChangeGrid({ detail }) {
            this.gridIndex = detail.index;
            console.log("gridIndex", this.gridIndex);
        },
        onClickList(detail) {
            console.log("listIndex", detail);
            this.listIndex = detail;
        },
        loginlout() {
            this.loading = true;
            setTimeout(() => {
                this.loading = false;
            });
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$page-padding: 0rpx 20rpx;

.user {
    position: static;
    overflow: hidden;
    width: 100vw;
}

.user-header {
    height: 300rpx;
    width: 100%;
    background-image: url('/static/img/user_bg_head.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
}

.user-card {
    display: flex;
    flex-direction: row;
    align-content: space-between;
    align-items: center;
    height: 80%;
    padding: $page-padding;

    .card-setting {
        position: relative;
        top: -40rpx;
        flex: 2;
        display: flex;
        flex-direction: row;
        align-items: center;
        text-align: right;

        &-icon {
            height: 36rpx;
            width: 36rpx;
            margin-left: 40rpx;
        }
    }
}

.grids {
    position: relative;
    top: -60rpx;
    margin: 0 40rpx;
    padding: 16rpx 0rpx;
    background-color: #fff;
    border-bottom: 2rpx solid $color-primary;
    border-radius: 24rpx;
}

.grid {
    &-item {
        flex: 1 1 1;
    }

    &-box {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center;
        height: 100%;
    }

    &-image {
        width: 80rpx;
        height: 80rpx;
        border-radius: $border-radius-circle;
    }

    &-text {
        margin-top: 10rpx;
        font-size: $font-size-sm;
    }
}

.links {
    margin-top: 10rpx;
}

.list {
    font-size: $font-size-md;

    &-image {
        width: 40rpx;
        height: 40rpx;
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