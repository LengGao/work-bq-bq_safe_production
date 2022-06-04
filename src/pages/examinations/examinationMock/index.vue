<template>
  <view class="examination-mock">
    <CustomHeader></CustomHeader>
    <image class="b-img" src="../static/mock-background.png" mode="aspectFit"></image>
    <view class="examination-mock-content">
      <view class="examinationcard-bar">
        <view class="xamination-card" v-for="(item, index) in examinations" :key="index" @click="() => handleClick(item.url)">
          <view class="card-body-row">
            <view class="card-body-left">
              <image :src="item.thumb" class="card-row-image" mode="aspectFit" />
            </view>
            <view class="card-body-right">
              <view class="card-right-top">
                <text>{{ item.name }}</text>
              </view>
              <view class="card-right-footer">
                <text>{{ item.desc }}</text>
              </view>
            </view>
            <view class="card-arrow">
              <image class="card-arrow-img" :src="item.arrow" mode="aspectFit" />
            </view>
          </view>
        </view>

      </view>
    </view>
  </view>

</template>

<script>
import CustomHeader from '@/components/custom-header'

export default {
  components: {
    CustomHeader
  },
  data() {
    return {
      examinations: [
        { 
          name: "人工组卷", desc: '这是描述文案', 
          arrow: '/pages/examinations/static/examinationMock_bg_list1.png', 
          thumb: '/pages/examinations/static/examinationMock_icon1.png', 
          url: "/pages/examinations/independentPaper/index"
        },
        {
          name: "随机考试", desc: '这是描述文案', 
          arrow: '/pages/examinations/static/examinationMock_bg_list2.png', 
          thumb: '/pages/examinations/static/examinationMock_icon2.png', 
          url: '/pages/examinations/testPaperIntroduce/index?source=examRandom'
        }
      ]
    }
  },
  methods: {
    handleClick(url) {
      uni.navigateTo({ url })
    }
  }

}
</script>

<style lang="scss" scoped>
@import "@/styles/logan.scss";
$size: 80rpx;

.examination-mock {
  height: 100%;
  .b-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 448rpx;
    z-index: -1;
  }
  &-content {
    position: relative;
    top: 350rpx;
    left: 0;
    height: calc(100% - 350rpx);
    border-radius: 16rpx;
    background-color: #fff;
  }
}

.examinationcard-bar {
  padding: 20rpx;
  
  .xamination-card {
    position: relative;
    margin-top: 40rpx;
    height: 146rpx;
    border-radius: 10rpx;
    background-color: #F6FBFF;
  }

  .xamination-card:nth-of-type(2) {
    background-color: #FFF7F7;
  }

  .card-body-row {
    position: relative;
    display: flex;
    flex-basis: 4;
    flex-direction: row;
    align-items: center;
    height: 100%;
    overflow: hidden;
    box-sizing: content-box;
  }

  .card-body-left {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1 1 1;
    margin-left: 20rpx;
    height: 100%;
    width: $size;
  }

  .card-row-image {
    width: 72rpx;
    height: 72rpx;
  }

  .card-body-right {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: flex-start;
    flex: 3 1 0;
    overflow: hidden;
    margin-left: 20rpx;
    height: $size;
    font-size: 32rpx;
    color: #333;
    letter-spacing: 1rpx;
  }

  .card-right-top {
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    width: 100%;
    font-size: $font-size-md;
    color: $text-color;
    font-weight: bold;
  }

  .card-right-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    font-size: $font-size-sm;
    color: #999999;
    font-size: $font-size-sm;
  }

  .card-arrow {
    &-img {
      position: absolute;
      top: -6rpx;
      right: 0;
      width: 72rpx;
      height: 72rpx;
    }
  }
}
</style>