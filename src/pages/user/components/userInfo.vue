<template>
<view class="user-info" :class="customClass" :style="customStyle">
    <view class="avator">
        <image class="avator" :src="info.avator || Avator" mode="aspectFit" />
    </view>
    <view class="infos">
        <view class="user">
            <text class="name"> {{ info.name }} </text>
            <text class="phone"> {{ info.phone }} </text>
        </view>
        <view class="days">加入东培学堂 {{ info.days }} 天</view>
    </view>
</view>
</template>

<script>
import Avator from "@/static/logo.png";
export default {
    props: {
        info: { type: Object, default: {} },
        customStyle: { default: '' },
        customClass: { default: '' },
    },
    data() {
        return {
            Avator
        }
    },
    mounted() {
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/logan.scss';
$height: 100rpx;

.user-info {
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
    margin-left: 20rpx;
}

.user {
    width: 100%;
    overflow: hidden;
    color: $color-primary;
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
    color: #999;
}

</style>