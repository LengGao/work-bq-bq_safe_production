<template>
    <view class="examination">
        <swiper
            @change="onChangeSwiper"
            :interval="2000"
            autoplay
            circular
            disable-touch
        >
            <swiper-item
                v-for="swiper in swipers"
                :key="swiper.id"
                :current-item-id="swiper.id"
            >
                <image
                    :src="swiper.thumb"
                    class="swiper-image"
                    mode="aspectFit"
                />
                {{ swipers }}
            </swiper-item>
        </swiper>
    </view>
</template>

<script>
export default {
    data() {
        return {
            // 轮播
            swipers: [
                { id: 1, thumb: "../../static/logo.png", url: "" },
                { id: 2, thumb: "../../static/logo.png", url: "" },
                { id: 3, thumb: "../../static/logo.png", url: "" },
            ],
        };
    },
    methods: {
        onChangeSwiper() {},
    },
};
</script>

<style lang="scss" scoped>
.examination {
    width: 100%;
    overflow: hidden;
}
</style>