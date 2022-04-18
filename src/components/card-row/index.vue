<template>
<view class="card-row">
    <view class="logan-card-body">
        <slot name="cardBodyLeft">
            <view class="logan-card-body-left">
                <image @load="onLoadImage" @errr="onErrorImage"
                    class="logan-card-row-image" :src="leftImage || errorImag" 
                    mode="aspectFit" webp
                />
            </view>
        </slot>
        <slot name="cardBodyRight">
            <view class="logan-card-body-right">
                <view class="logan-card-right-top">
                    <slot name="rightTop"> {{ rightTop }} </slot>
                </view>
                <view class="logan-card-right-center">
                    <slot name="rightCenter"> {{ rightCenter }} </slot>
                    <slot name="rightCenterIcon"></slot>
                </view>
                <view class="logan-card-right-footer">
                    <slot name="rightFooter"> {{ rightFooter }} </slot>
                    <slot name="rightFooterIcon"></slot>
                </view>
            </view>
        </slot>
    </view>
</view>
</template>

<script>
import errorImag from '@/static/imgerror.png'
export default {
    name: 'CardRow',
    props: {
        leftImage: {
            default: ''
        },
        rightTop: {
            default: ''
        },
        rightCenter: {
            default: ''
        },
        rightFooter: {
            default: ''
        }
    },
    data() {
        return {
            errorImag: errorImag
        }
    },
    mounted() {
    },
    methods: {
        onLoadImage() {
            console.log('onLoadImage', arguments);
        },
        onErrorImage() {
            console.log('onErrorImage', arguments);
            Promise.resolve(errorImag).then(res => this.leftImage = res)
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/styles/logan.scss';

.card-row {
    position: relative;
}

.logan-card-body {
    position: relative;
    display: flex;
    flex-basis: 4;
    flex-direction: row;
    align-items: center;
    height: $img-size-height-md; // 同时控制着子元素的高度
    overflow: hidden;
    padding: 16rpx 20rpx;
    box-sizing: content-box;
}

.logan-card-body-left {
    display: flex;
    flex-direction: row;
    align-items: center;
    height: 100%;
    width: $img-size-width-md;
}

.logan-card-row-image {
    width: $img-size-width-md;
    height: $img-size-height-md;
}

.logan-card-body-right {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    flex: 3;
    height: 100%;
    overflow: hidden;
    margin-left: 10rpx;
    font-size: $font-size-base;
}

.logan-card-right-top {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    flex: 0 1 1;
    width: 100%;
    color: $text-color;
}

.logan-card-right-center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;;
    align-items: flex-start;
    flex: 2 1 0;
    width: 100%;
    color: $text-color-grey;
}

.logan-card-right-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
    flex: 0 1 1;
    width: 100%;
    color: $text-color-grey;
}
</style>